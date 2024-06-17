const { ipcRenderer } = require('electron');
const { loadHTMLContent } = require('./utils/loader');

// Get reference to the content container
const contentContainer = document.getElementById('content-container');
const loginContainer = document.getElementById('login-container');

document.getElementById('overview').addEventListener('click', async () => {
  await loadHTMLContent(contentContainer, 'pages/overview/overview.html');
  ipcRenderer.send('get-user-balance', 'some-argument');
  ipcRenderer.send('get-recent-transactions', 'some-argument');
});

document.getElementById('send').addEventListener('click', () => {
  loadHTMLContent(contentContainer, 'pages/send/send.html');
});

document.getElementById('receive').addEventListener('click', () => {
  loadHTMLContent(contentContainer, 'pages/receive/receive.html');
});

document.getElementById('transactions').addEventListener('click', () => {
  loadHTMLContent(contentContainer, 'pages/transactions/transactions.html');
});

ipcRenderer.on('user-balance-response', (event, balance) => {
  document.getElementById('confirmed_balance').textContent = `${balance} BTC`;
});

ipcRenderer.on('get-recent-transactions', (event, transactions) => {
  const transactionsContainer = document.getElementById('recent_transactions');
  transactionsContainer.innerHTML = transactions.map(transaction =>
    `
    <div style="display: flex; margin-bottom: 20px">
      <div class="transaction-info">
          <div class="date">${transaction.date}</div>
          <div class="to">${transaction.to}</div>
      </div>
      <div class="amount" style="margin-left: 50px; color: ${transaction.amount[0] === '-' ? 'red' : 'green'}">${transaction.amount}</div>
    </div>
    `).join('');
});

const loadingBar = document.querySelector('.loading-bar');
loadingBar.style.width = `${150}px`;
loadingBar.classList.add('progress');

// Get buttons by their IDs
const importBtn = document.getElementById('import-btn');
const createBtn = document.getElementById('create-btn');

// Add event listeners to handle focus class toggling
importBtn.addEventListener('click', () => {
  // Remove focus class from all buttons
  importBtn.classList.add('focus');
  createBtn.classList.remove('focus');
  loadHTMLContent(loginContainer, 'login/import/import_wallet.html');
});

createBtn.addEventListener('click', () => {
  // Remove focus class from all buttons
  createBtn.classList.add('focus');
  importBtn.classList.remove('focus');
  loadHTMLContent(loginContainer, 'login/create/create_wallet.html');
});
