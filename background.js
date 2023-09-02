chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.command === "toggleGrayscale") {
    toggleGrayscale();
    console.log("Background- Grayscale Toggled");
  } else if (request.command === "toggleComments") {
    toggleComments();
    console.log("Background- Comments Toggled");
  } else if (request.command === "toggleShorts") {
    toggleShorts();
    console.log("Background- Shorts Toggled");
  }else if (request.command === "toggleRelated") {
      toggleRelated();
      console.log("Background- Related Toggled");
    } else if (request.redirect === "https://www.youtube.com/") {
    chrome.tabs.update(sender.tab.id, { url: request.redirect });
  }
});

function toggleGrayscale() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var currentTab = tabs[0];
    var storageKey = "grayscaleEnabled";
    chrome.storage.sync.get(storageKey, function (data) {
      var isGrayscale = data[storageKey];
      chrome.storage.sync.set({ [storageKey]: isGrayscale }, function () {
        // Send a message to content.js after you've toggled and saved the grayscale setting
        chrome.tabs.sendMessage(currentTab.id, { command: "applyStyles" });
      });
    });
  });
}

function toggleComments() {
  // Fetch the current state of comments from storage
  chrome.storage.sync.get("commentsDisabled", function (data) {
    let currentState = data.commentsDisabled;
    // Toggle the state
    let newState = !currentState;
    chrome.storage.sync.set({ commentsDisabled: newState }, function () {
      // Fetch the current active tab to get its tabId
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currentTab = tabs[0];
        if (currentTab && currentTab.id) {
          // Notify the content script in the current active tab to apply the changes
          chrome.tabs.sendMessage(currentTab.id, { command: "applyStyles" });
        }
      });
    });
  });
}

function toggleShorts() {
  chrome.storage.sync.get("shortsRedirectEnabled", function (data) {
    let enabled = data.shortsRedirectEnabled;
    chrome.storage.sync.set({ shortsRedirectEnabled: !enabled });
  });
}

function toggleRelated() {
  // Fetch the current state of comments from storage
  chrome.storage.sync.get("relatedDisabled", function (data) {
    let currentState = data.relatedDisabled;
    // Toggle the state
    let newState = !currentState;
    chrome.storage.sync.set({ relatedDisabled: newState }, function () {
      // Fetch the current active tab to get its tabId
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currentTab = tabs[0];
        if (currentTab && currentTab.id) {
          // Notify the content script in the current active tab to apply the changes
          chrome.tabs.sendMessage(currentTab.id, { command: "applyStyles" });
        }
      });
    });
  });
}


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.url &&
    changeInfo.url.includes("https://www.youtube.com/shorts/")
  ) {
    chrome.storage.sync.get("shortsRedirectEnabled", function (data) {
      let enabled = data.shortsRedirectEnabled;
      if (enabled) {
        chrome.tabs.update(tab.id, { url: "https://www.youtube.com/" });
        // Execute the alert in the context of the content.
        chrome.tabs.executeScript(tab.id, {
          code: 'window.alert("Youtube Shorts Are Currently Blocked");',
        });
      }
    });
  }
});

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set(
    {
      shortsRedirectEnabled: true, // Enable YouTube shorts redirect by default
      grayscaleEnabled: true, // Enable grayscale by default
      commentsDisabled: true, // Disable comments by default
      relatedDisabled: true // Disable related content by default
    },
    function () {
      if (chrome.runtime.lastError) {
        console.error(
          "Error setting initial values:",
          chrome.runtime.lastError
        );
      } else {
        console.log("Initial values set successfully!");
      }
    }
  );
});

chrome.webNavigation.onCompleted.addListener(function (details) {
  // This event fires when the DOM is fully loaded in a tab.
  // Use the tabId provided by the 'details' object directly.
  chrome.tabs.sendMessage(details.tabId, { command: "applyStyles" });
  console.log("DOM fully loaded in tab:", details.tabId);
});
