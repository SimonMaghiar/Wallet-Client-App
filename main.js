const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const { getUserBalance, getRecentTransactions } = require('./utils/overview');
const { checkSocketPath } = require('./utils/socketUtils');
const net = require('net');
const bip39 = require('bip39');

const userInformation = {
  publicKey: null
};

const pipePath1 = '/tmp/rst1.sock'; // Wallet Recovery
const pipePath2 = '/tmp/rst2.sock'; // Wallet Generation

const pathsToWatch = [ 
  path.join(__dirname, 'pages', 'overview', '*'), // Add the path to overview.css
  path.join(__dirname, 'pages', 'receive', '*'),
  path.join(__dirname, 'pages', 'send', '*'),
  path.join(__dirname, 'pages', 'transactions', '*'),
  path.join(__dirname, 'login', 'import', '*'),
  path.join(__dirname, 'login', 'create', '*'),
  path.join(__dirname, 'login', '*'),
  path.join(__dirname, '*')
];

// Enable live reload for all the files inside your project directory
require('electron-reload')(pathsToWatch, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('get-user-balance', async (event, arg) => {
  const balance = await getUserBalance();
  event.reply('user-balance-response', balance);
});

ipcMain.on('get-recent-transactions', async (event, arg) => {
  const recentTransactions = await getRecentTransactions();
  event.reply('get-recent-transactions', recentTransactions);
});

ipcMain.on('import-wallet', async (event, recoveryPhrase) => {
  // Here you would handle the recovery phrase, e.g., derive private keys, set up the wallet, etc.
  const reply = {
    isPhraseInvalid: false,
    error: ''
  };

  if (!bip39.validateMnemonic(recoveryPhrase)) {
    reply.isPhraseInvalid = true;
    event.reply('import-wallet', reply);
    return;
  }
  try {
    const isSocketAvailable = await checkSocketPath(pipePath1);
    if (isSocketAvailable) {
      const client = net.createConnection(pipePath1, () => {
        console.log('Connected to Rust!');
        client.write(recoveryPhrase);
      });
      // Handle data received from the socket
      client.on('data', (data) => {
        console.log('Received: ', data.toString());
        if (data.toString().length === 66) {
          userInformation.publicKey = data.toString();
        } else {
          reply.isPhraseInvalid = true;
          reply.error = 'Wallet Generation Failed!';
        }
      });

      // Handle errors that occur during the connection
      client.on('error', (error) => {
        console.error('Socket connection error:', error);
        reply.isPhraseInvalid = true;
        reply.error = 'Wallet Generation Failed!';
        // Handle the error appropriately, e.g., notify the user, retry, etc.
      });
    } else {
      console.log('Socket is not open');
    }
  } catch (error) {
    console.log('Unexpected error occured: ', error);
    // Handle synchronous errors that might occur within the try block
  }
  setTimeout(() => {
    event.reply('import-wallet', reply);
  }, 2000);
});

ipcMain.on('generate-wallet', async (event, selectedLength) => {
  const reply = {
    publicKey: null,
    mnemonic: null,
    error: ''
  };
  const recoveryPhraseLength = selectedLength === '12-words' ? 12 : 24;
  const isSocketAvailable = await checkSocketPath(pipePath2);
  if (!isSocketAvailable) {
    return;
  }

  try {
    const client = net.createConnection(pipePath2, () => {
      console.log('Connected to Rust!');
      client.write(recoveryPhraseLength.toString());
    });
    // Handle data received from the socket
    client.on('data', (data) => {
      const dataReceived = data.toString().split(' / ');
      const publicKey = dataReceived[0];
      const recoveryPhrase = dataReceived[1].replaceAll('\x00', '');

      if (!bip39.validateMnemonic(recoveryPhrase)) {
        reply.error = 'Invalid Recovery Phrase Generated';
        event.reply('generate-wallet', reply);
        return;
      }
      userInformation.publicKey = publicKey;

      reply.publicKey = publicKey;
      reply.mnemonic = recoveryPhrase;
      event.reply('generate-wallet', reply);
    });

    // Handle errors that occur during the connection
    client.on('error', (error) => {
      console.error('Socket connection error:', error);
    });
  } catch (error) {
    console.log('Unexpected error occured: ', error);
    // Handle synchronous errors that might occur within the try block
  }
});
