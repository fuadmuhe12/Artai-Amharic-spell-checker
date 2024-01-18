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
class SpellcheckAPIManager {
    // http://localhost:4000/check?
    sentData; //to the Engine
    recievedData; // from the  Engine
    sendRequestToEngine(text) {
        backgroundLogger.info("sending text for scan to the engine : API")
        let dataToSend = {
            text: text
        }
        fetch(`http://localhost:4000/check?text=${text}`, {
            method:"GET"
        })
        .then(response => response.json())
        .then(resultData => { 
            console.log(resultData)
            console.log(resultData.success, "cheking succes")
            if (resultData.success){
                backgroundLogger.log("succesfully recieved data from the Engine")
                this.returnResult(resultData)
            }
            else{
                backgroundLogger.log("failed to recieve data from the Engine")
            }
            

        })
        //send text to the Engine
    }
    returnResult(result) {
        backgroundLogger.info("sending scan result to communication manager : API")
        spellcheckCommunicationManager.sendCorrectedText(result)
        //recieve text from the Engine
        
    }
}
const spellcheckAPIManager = new SpellcheckAPIManager();

//-------------------------------------------------------------------------------------//-----------------------------------------------------------------------------------------------------
// class of spellcheckCommunicationManager
class SpellcheckCommunicationManager {
    textForScanning;
    correctedText;
    spellcheckAPIManager = spellcheckAPIManager; 
    sendTextforScanning(text) {
        backgroundLogger.info("sending text to the API manager for the scan")
        spellcheckAPIManager.sendRequestToEngine(text)
        // send text to the spellcheckAPIManager
        
    }
    // recieveCorrectedText() {
    //     // recieve text from the spellcheckAPIManager
    //     // TODO: implement this function
    // }
    sendCorrectedText(resultData) {
        backgroundLogger.log("sending corrected text to content script");
        // send text to the content script
        let messageToContentScript = {
            type: "correctedText",
            correctedText: resultData
        }; // demo data
        /* {
              result: 
            
                    text: "እኛ አለን እና ሰዎች ናቸው ። ድቭድፍቭ ሰዎች እና አሉ።",
                    errors: [
                        {
                            word: "ናቸው",
                            suggestions: ["ሰዋች", "ሳው", "ስው"],
                        },
                        {
                            word: "ሰዎች",
                            suggestions: ["ናችህው", "ንችህ", "ናችህስ"],
                        },
                        {
                            word: "ድቭድፍቭ",
                            suggestions: [],
                        },
                        {
                            word: "ናቸው",
                            suggestions: ["ሰዋች", "ሳው", "ስው"],
                        },
                        
                    ],
                },
            }
        */
        console.log(`sending message to content script: ${messageToContentScript}`);

        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, messageToContentScript, function(response) {
                if (response) {
                    console.log(`response from content script: ${response.result}`);
                } else {
                    console.log('No response from content script');
                }
            });
        });
        
    }
  

        
}

const spellcheckCommunicationManager = new SpellcheckCommunicationManager();

//----//-------------------------------------------------------------------------------------//-----------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------//-----------------------------------------------------------------------------------------------------
let contentLogger = "Logger from content script not received yet";
// Listen for messages from the content script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "sendLogger") {
        backgroundLogger.log("Logger received from content script");
        // Process the Logger instance
        let loggerMessages = request.logger;
        contentLogger = loggerMessages;
        sendResponse({ result: "Logger received from background script" });
    } else if (request.type === "textforScanning") {
        backgroundLogger.log("text for scanning received from content script");
        console.log(`text for scanning received from content script: ${request.data}`);
        // Process the text
        let text = request.data;
        sendResponse({
            result: `succesfully received text ${text} from content script: from background script `,
        });

        spellcheckCommunicationManager.sendTextforScanning(text);

        
        
    }
});

console.log("background script loaded");
