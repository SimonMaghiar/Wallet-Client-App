function importWallet () {
  const recoveryPhrase = document.getElementById('recovery-phrase').value.trim();

  if (!recoveryPhrase) {
    showMessage('Please enter your recovery phrase.', 'error');
    return;
  }

  // Determine if it's 12 or 24 words
  const wordCount = recoveryPhrase.split(' ').length;
  if (wordCount !== 12 && wordCount !== 24) {
    showMessage('Invalid recovery phrase length. Must be 12 or 24 words.', 'error');
    return;
  }

  showMessage('Importing wallet...', 'notice');

  // Send the recovery phrase to the main process via IPC
  ipcRenderer.send('import-wallet', recoveryPhrase);
}

function showMessage (message, type) {
  const messageElement = document.getElementById('message');
  messageElement.textContent = message;
  messageElement.className = `message ${type}`;
}

ipcRenderer.on('import-wallet', (event, reply) => {
  console.log(reply);
  if (reply.error) {
    showMessage(reply.error, 'error');
    return;
  }
  if (reply.isPhraseInvalid) {
    showMessage('Invalid recovery phrase. Checksum failed.', 'error');
  } else {
    // Simulating a delay (remove this in actual implementation)
    setTimeout(() => {
      showMessage('Wallet imported successfully!', 'success');
      // Reset the input field after successful import
      document.getElementById('recovery-phrase').value = '';
      setTimeout(() => {
        const loginContainer1 = document.getElementById('login-container');
        const loginContainer2 = document.getElementById('login-form');
        loginContainer1.style.display = 'none';
        loginContainer2.style.display = 'none';
        // Show the main content
        const mainContent = document.getElementById('main-content');
        mainContent.style.display = 'block'; // or 'flex', 'grid', etc. based on your layout
      }, 500);
    }, 2000);
  }
});
