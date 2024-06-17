async function loadHTMLContent (domElement, filename) {
  const response = await fetch(filename);
  const html = await response.text();
  setTimeout(() => {
    domElement.innerHTML = html;
  }, 50);
}

// function loadCSS (filename, callback) {
//   // Remove any previously added CSS file (if any)
//   const previousLink = document.getElementById('dynamic-css');
//   if (previousLink) {
//     previousLink.parentNode.removeChild(previousLink);
//   }

//   const link = document.createElement('link');
//   link.rel = 'stylesheet';
//   link.type = 'text/css';
//   link.id = 'dynamic-css';
//   link.href = filename;

//   // Attach the onload event to execute the callback after the CSS is loaded
//   if (callback) {
//     link.onload = function () {
//       callback();
//     };
//   }
//   document.head.appendChild(link);
// }

module.exports = { loadHTMLContent };
