// Load the saved state of the extension
chrome.storage.sync.get('commentsEnabled', function(data) {
    // Check if the current URL contains 'https://www.youtube.com/shorts/'
    if (window.location.href.includes('https://www.youtube.com/shorts/')) {
        // If it does, send a message to the background script to redirect
        chrome.runtime.sendMessage({redirect: 'https://www.youtube.com/'});
    } else if (!data.commentsEnabled) { // If comments are disabled
        // Create a new stylesheet
        var style = document.createElement('style');
        style.type = 'text/css';

        // Define the CSS rules to make everything black and white except for the video player and to hide the comments
        var css = `html, body, * :not(#player) { filter: grayscale(100%); }
                   #player, #player * { filter: none; }
                   html, body, * :not(#player):hover { filter: none; }
                   #comments { display: none; } 
                   `;

        // Set the CSS rules as the content of the stylesheet
        style.appendChild(document.createTextNode(css));

        // Append the stylesheet to the document
        document.head.appendChild(style);
    }
});

// Listen for messages
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.refresh) {
      // Refresh the page
      location.reload();
    }
  }
);