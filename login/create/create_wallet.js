function generateWallet() {
  // Simulate generating wallet
  showMessage('Wallet generation...', 'notice');
  const selectedLength = document.getElementById('wallet_length');
  ipcRenderer.send('generate-wallet', selectedLength.value);
}

function showMessage (message, type) {
  const messageElement = document.getElementById('message');
  messageElement.textContent = message;
  messageElement.className = `message ${type}`;
}

function accept () {
  setTimeout(() => {
    const loginContainer1 = document.getElementById('login-container');
    const loginContainer2 = document.getElementById('login-form');
    loginContainer1.style.display = 'none';
    loginContainer2.style.display = 'none';
    // Show the main content
    const mainContent = document.getElementById('main-content');
    mainContent.style.display = 'block'; // or 'flex', 'grid', etc. based on your layout
  }, 500);
}

function moveToLeft (publicKey, mnemonic) {
  const walletContainer = document.getElementById('walletContainer');
  const walletGenerated = document.getElementById('wallet-generated-container');
  walletContainer.style.left = '0'; /* Move to the left */
  walletContainer.style.transform = 'translateX(-75%)'; /* Reset transform */
  walletGenerated.innerHTML = `
  <div>
    <h3 style="text-align: center; text-decoration: underline;">Your Wallet Information</h3>
    <p style="overflow: hidden;"> <strong>Public Address: </strong>0x${publicKey}</p>
    <p style="overflow: hidden;"> <strong>Secret Recovery Phrase: </strong>${mnemonic}</p>
    <button style="width: 100%; background-color: green; color: white; border: none; padding: 10px; cursor: pointer; font-weight: bold" onclick="accept()">
        Accept & Proceed
    </button>
  </div>
  `;
  walletGenerated.style.left = '0'; /* Move to the left */
  walletGenerated.style.transform = 'translateX(50%)'; /* Reset transform */
  walletGenerated.style.width = '600px';
}

ipcRenderer.on('generate-wallet', (event, reply) => {
  if (reply.error) {
    showMessage(reply.error, 'error');
  } else {
    showMessage('Wallet generated successfully!', 'success');
    moveToLeft(reply.publicKey, reply.mnemonic);
  }
});
