const { ipcRenderer } = require('electron');

// Get reference to the content container
const contentContainer = document.getElementById('content-container');

async function loadHTMLContent (filename) {
  try {
    const response = await fetch(filename);
    const html = await response.text();
    contentContainer.innerHTML = html;
  } catch (error) {
    console.error('Error fetching HTML:', error);
  }
}

document.getElementById('overview').addEventListener('click', async () => {
  await loadHTMLContent('pages/overview/overview.html');
  ipcRenderer.send('get-user-balance', 'some-argument');
  ipcRenderer.send('get-recent-transactions', 'some-argument');
});

document.getElementById('send').addEventListener('click', () => {
  loadHTMLContent('pages/send/send.html');
});

document.getElementById('receive').addEventListener('click', () => {
  loadHTMLContent('pages/receive/receive.html');
});

document.getElementById('transactions').addEventListener('click', () => {
  loadHTMLContent('pages/transactions/transactions.html');
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
