const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const { getUserBalance, getRecentTransactions } = require('./utils/overview');

const pathsToWatch = [
  path.join(__dirname, 'pages', 'overview', '*'), // Add the path to overview.css
  path.join(__dirname, 'pages', 'receive', '*'),
  path.join(__dirname, 'pages', 'send', '*'),
  path.join(__dirname, 'pages', 'transactions', '*'),
  path.join(__dirname, 'login', 'import', '*'),
  path.join(__dirname, 'login', 'create', '*'),
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

app.whenReady().then(createWindow);

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
