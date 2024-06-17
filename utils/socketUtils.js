const fs = require('fs');

function checkSocketPath (socketPath) {
  return new Promise((resolve, reject) => {
    fs.stat(socketPath, (err, stats) => {
      if (err) {
        if (err.code === 'ENOENT') {
          // Socket file does not exist
          resolve(0);
        } else {
          // Other error while checking socket file
          reject(err);
        }
      } else {
        if (stats.isSocket()) {
          // Socket file exists and is a socket
          resolve(1);
        } else {
          // Path exists but is not a socket
          resolve(0);
        }
      }
    });
  });
}

module.exports = { checkSocketPath };