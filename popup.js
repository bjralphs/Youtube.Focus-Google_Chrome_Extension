document.addEventListener('DOMContentLoaded', function() {
  var checkbox = document.getElementById('toggleCheckbox');

  // restore saved state
  chrome.storage.sync.get('commentsEnabled', function(data) {
    checkbox.checked = data.commentsEnabled === false; // false if comments are disabled
  });

  // listen for checkbox state change
  checkbox.addEventListener('change', function() {
    chrome.storage.sync.set({commentsEnabled: !this.checked}, function() {
      var status = document.getElementById('status');
      status.textContent = this.checked ? 'Comments disabled.' : 'Comments enabled.';
      setTimeout(function() { status.textContent = ''; }, 2000);
      // send message to content script
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {refresh: true});
      });
    });
  });
});