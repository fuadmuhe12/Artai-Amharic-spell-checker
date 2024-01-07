//logger class
// Enum for log levels
const LogLevel = {
    Info: 1,
    Warn: 2,
    Error: 3,
    // Add more levels as needed
};
class Logger {
    constructor(options = {}) {
        this.level = options.level || LogLevel.Info;
        this.logMessages = [];
    }

    log(message, level = LogLevel.Info) {
        if (level >= this.level) {
            const formattedMessage = this.formatMessage(message, level);
            this.logMessages.push(formattedMessage); // Store the message in the array
        }
    }

    info(message) {
        this.log(message, LogLevel.Info);
    }

    warn(message) {
        this.log(message, LogLevel.Warn);
    }

    error(message) {
        this.log(message, LogLevel.Error);
    }

    formatMessage(message, level) {
        // Include contextual information in the log message
        const timestamp = new Date().toISOString();
        return `[${timestamp}] (${level}): ${message}`;
    }

    // Retrieve stored log messages
    getLogMessages() {
        return this.logMessages;
    }

    // Clear stored log messages
    clearLogMessages() {
        this.logMessages = [];
    }
}
const backgroundLogger = new Logger();
backgroundLogger.log("background script loaded");

//-------------------------------------------------------------------------------------//-----------------------------------------------------------------------------------------------------
// class of spellcheckAPIManager
class SpellcheckAPIManager{
    sentData;//to the Engine
    recievedData // from the  Engine
    sendRequestToEngine(text){
        //send text to the Engine
        // TODO: implement this function
    };
    recieveresposeFromEngine(){
        //recieve text from the Engine
        // TODO: implement this function
    }

    


};
const spellcheckAPIManager = new SpellcheckAPIManager();
    

//-------------------------------------------------------------------------------------//-----------------------------------------------------------------------------------------------------
// class of spellcheckCommunicationManager
class SpellcheckCommunicationManager{
    textForScanning;
    correctedText;
    spellcheckAPIManager = spellcheckAPIManager; // TODO: implement this class
    sendTextforScanning(text){
        // send text to the spellcheckAPIManager
        // TODO: implement this function
    };
    recieveCorrectedText(){
        // recieve text from the spellcheckAPIManager
        // TODO: implement this function   
    }
    sendCorrectedText(){
        // send text to the content script
        let messageToContentScript = {
            type: "correctedText",
            correctedText: this.correctedText
        };
        chrome.runtime.sendMessage(messageToContentScript, backgroundLogger.info("corrected text sent to content script"));
        
        

    }
    
}
const spellcheckCommunicationManager = new SpellcheckCommunicationManager();

//----//-------------------------------------------------------------------------------------//-----------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------//-----------------------------------------------------------------------------------------------------
var contentLogger = "Logger from content script not received yet"
// Listen for messages from the content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "sendLogger") {
        backgroundLogger.log("Logger received from content script");
        // Process the Logger instance
        var  loggerMessages = request.logger;
        contentLogger = loggerMessages;
        sendResponse({result: "Logger received from background script"});
    }
    else if (request.type === "textforScanning") {
        loggerMessages.log("text for scanning received from content script");
        // Process the text
        var text = request.text;
        sendResponse({result: `succesfully received text ${text} from content script `});
        spellcheckCommunicationManager.textForScanning = text;

    }
});
console.log("background script loaded");