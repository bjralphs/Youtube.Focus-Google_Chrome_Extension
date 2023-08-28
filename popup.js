// When the popup is loaded, retrieve the saved states from chrome.storage.sync
document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.sync.get(
    ["grayscaleEnabled", "commentsDisabled", "shortsRedirectEnabled"],
    function (data) {
      document.getElementById("grayscale-toggle").checked =
        data.grayscaleEnabled;
      document.getElementById("comments-toggle").checked =
        data.commentsDisabled;
      document.getElementById("shorts-toggle").checked =
        data.shortsRedirectEnabled;
    }
  );
});

// Grayscale Toggle
document
  .getElementById("grayscale-toggle")
  .addEventListener("change", function (e) {
    chrome.runtime.sendMessage({ command: "toggleGrayscale" });

    // Save the state of grayscale to chrome.storage.sync
    chrome.storage.sync.set(
      { grayscaleEnabled: e.target.checked },
      function () {
        // Notify the user with a simple status update (optional)
        var status = document.getElementById("status");
        status.textContent = e.target.checked
          ? "Grayscale enabled."
          : "Grayscale disabled.";
        setTimeout(function () {
          status.textContent = "";
        }, 2000);

        // Send a message to the content script to refresh or take necessary action
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { refresh: true });
          }
        );
      }
    );
  });

// Comments Disabling Toggle
document
  .getElementById("comments-toggle")
  .addEventListener("change", function (e) {
    chrome.runtime.sendMessage({ command: "toggleComments" });

    // Save the state of comments to chrome.storage.sync
    chrome.storage.sync.set(
      { commentsDisabled: !e.target.checked },
      function () {
        var status = document.getElementById("status");
        status.textContent = e.target.checked
          ? "Comments Disabled."
          : "Comments Enabled.";
        setTimeout(function () {
          status.textContent = "";
        }, 2000);

        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { refresh: true });
          }
        );
      }
    );
  });

// Shorts Disabling Toggle
document
  .getElementById("shorts-toggle")
  .addEventListener("change", function (e) {
    chrome.runtime.sendMessage({ command: "toggleShorts" });

    // Save the state of shorts redirect to chrome.storage.sync
    chrome.storage.sync.set(
      { shortsRedirectEnabled: !e.target.checked },
      function () {
        var status = document.getElementById("status");
        status.textContent = e.target.checked
          ? "Shorts redirect enabled."
          : "Shorts redirect disabled.";
        setTimeout(function () {
          status.textContent = "";
        }, 2000);

        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { refresh: false });
          }
        );
      }
    );
  });

//Troubleshooting Reset Button
document.getElementById("reset-button").addEventListener("click", function () {
  // Reset values in chrome.storage.sync
  chrome.storage.sync.set(
    {
      grayscaleEnabled: true, // Default enabled
      commentsDisabled: true, // Default enabled
      shortsRedirectEnabled: true, // Default enabled
    },
    function () {
      // Update UI to reflect this change
      document.getElementById("grayscale-toggle").checked = true;
      document.getElementById("comments-toggle").checked = true;
      document.getElementById("shorts-toggle").checked = true;

      var status = document.getElementById("status");
      status.textContent = "Extension Variables Reset.";
      setTimeout(function () {
        status.textContent = "";
      }, 2000);

      // Optionally: Notify the content script to apply these changes immediately
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { command: "applyStyles" });
        // Refresh the current active tab
        chrome.tabs.reload(tabs[0].id);
      });
    }
  );
});
