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

  // Process the recovery phrase (You would typically handle this securely)
  showMessage(`Importing wallet with recovery phrase: ${recoveryPhrase}`, 'success');
  // Here you would proceed to derive the private keys and set up the wallet

  // Simulating a delay (remove this in actual implementation)
  setTimeout(() => {
    showMessage('Wallet imported successfully!', 'success');
    // Reset the input field after successful import
    document.getElementById('recovery-phrase').value = '';
  }, 2000);
}

function showMessage (message, type) {
  const messageElement = document.getElementById('message');
  messageElement.textContent = message;
  messageElement.className = `message ${type}`;
}
