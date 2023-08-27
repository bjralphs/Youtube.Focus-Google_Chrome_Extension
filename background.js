chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.command === 'toggle') {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var currentTab = tabs[0];
            var storageKey = currentTab.url + '_' + currentTab.id;

            chrome.storage.sync.get(storageKey, function(data) {
                var isGrayscale = data[storageKey];

                // Flip the isGrayscale flag
                isGrayscale = !isGrayscale;
                var saveObject = {};
                saveObject[storageKey] = isGrayscale;
                chrome.storage.sync.set(saveObject);

                var code;
                // If grayscale is true, set the grayscale style
                if (isGrayscale) {
                    code = `
                        (function() {
                            var style = document.getElementById('grayscaleStyle') || document.createElement('style');
                            style.id = 'grayscaleStyle';
                            var css = 'html, body, * { filter: grayscale(100%); }';
                            style.textContent = css;
                            if (!style.parentNode) {
                                document.head.appendChild(style);
                            }
                        })();
                    `;
                // If grayscale is false, remove the grayscale style
                } else {
                    code = `
                        (function() {
                            var style = document.getElementById('grayscaleStyle');
                            if (style) {
                                style.remove();
                            }
                        })();
                    `;
                }

                // Execute the script on the current tab
                chrome.tabs.executeScript(currentTab.id, {code: code});
            });
        });
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.redirect === 'https://www.youtube.com/') {
        chrome.tabs.update(sender.tab.id, {url: request.redirect});
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        if (changeInfo.url.includes('https://www.youtube.com/shorts/')) {
            chrome.tabs.update(tab.id, {url: 'https://www.youtube.com/'});
        }
    }
});