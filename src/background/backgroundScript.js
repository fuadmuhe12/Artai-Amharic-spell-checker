var helow = "name"
// Listen for messages from the content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.command === "sendLogger") {
        // Process the Logger instance
        var  loggerMessages = request.logger;
        helow = loggerMessages;
        console.log(loggerMessages);
        sendResponse({result: "Logger received"});
    }
});
console.log("background script loaded");