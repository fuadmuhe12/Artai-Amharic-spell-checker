//-------------------------------------------------------------------------------------//-----------------------------------------------------------------------------------------------------
// class of spellcheckCommunicationManager
class spellcheckCommunicationManager{

}
//-------------------------------------------------------------------------------------//-----------------------------------------------------------------------------------------------------
var helow = "name"
// Listen for messages from the content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "sendLogger") {
        // Process the Logger instance
        var  loggerMessages = request.logger;
        helow = loggerMessages;
        sendResponse({result: "Logger received"});
    }
    else if (request.type === "scanText") {
        // Process the text
        var text = request.text;
        sendResponse({result: `Text received for scannig: ${text} `});
    }
});
console.log("background script loaded");