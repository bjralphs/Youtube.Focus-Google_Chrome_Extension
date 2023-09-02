// Apply styles based on stored states.
const applyStyles = () => {
  // Remove the old style tag if it exists
  const oldStyle = document.getElementById("customStyles");
  if (oldStyle) oldStyle.remove();

  chrome.storage.sync.get(["grayscaleEnabled", "commentsDisabled", "relatedDisabled"], (data) => {
    let css = ""; // Initialize css as an empty string.

    // Grayscale
    if (data.grayscaleEnabled) {
      css += `
            html, body, * { filter: grayscale(100%) !important; }
            #chips {visibility: hidden;}
        `;
    } else {
      css += `html, body, * {filter: none !important;}`;
    }
    // Related Disabling
    if (data.relatedDisabled) {
      css += `#related { display: none !important; }`;
    }   

    // Comments Disabling
    if (data.commentsDisabled) {
      css += `#comments { display: none !important; }`;
    }
    
    

    const style = document.createElement("style");
    style.type = "text/css";
    style.id = "customStyles";
    style.appendChild(document.createTextNode(css));
    document.body.appendChild(style);
    
  });
};

// Listen for messages.
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.command === "applyStyles") {
    applyStyles();
  }
});

document.addEventListener("DOMContentLoaded", applyStyles);
