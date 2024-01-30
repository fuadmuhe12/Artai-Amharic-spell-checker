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


    deleteDictWord(data){//dictionary
        //make sure user dictionary is not included as misspelled word
        let userDictionary = dictionaryManager.getDic();
        let errors = data.result.errors;
        let newErrors = [];
        for (let i = 0; i < errors.length; i++) {
            if (!userDictionary.has(errors[i].word)) {
                newErrors.push(errors[i]);
            }
        }
        data.result.errors = newErrors;
        return data;
    }
 
    sendCorrectedText(resultData) {
        backgroundLogger.log("sending corrected text to content script");
        
        // send text to the content script
        let messageToContentScript = {
            type: "correctedText",
            correctedText: this.deleteDictWord(resultData)
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
//----//-------------------------------------------------------------------------------------//-----------------------------------------------------------------------------------------------------
//dictionary class for user prefrence 
class DictionaryManager{ //dictionary
    dictionaryWords = new Set();
    addTodic(text){
        this.dictionaryWords.add(text);
        this.savetoStorage();
        console.log(this.dictionaryWords, "dictionary words   ");
        chrome.storage.local.get(['defaultDictionary'], (result) => {
            if(result.defaultDictionary) {
                console.log(result.defaultDictionary, "dictionary words from storage")
            } else {
                console.log("no dictionary found in storage   after adding  Fixxxxx");
            }
        });

    }
    removeFromDic(text){
        this.dictionaryWords.delete(text);
    }
    getDic(){
        return this.dictionaryWords;
    }
    clearDic(){
        this.dictionaryWords.clear();
    }
    isInDic(text){
        return this.dictionaryWords.has(text);
    }
    savetoStorage() {
        let toSave = {
            defaultDictionary: Array.from(this.dictionaryWords)
        }
        console.log(toSave, "to save")

        chrome.storage.local.set(toSave)
        .then(() => {
            backgroundLogger.log("data saved to storage");
        })
        .catch((error) => {
            console.error(error);
        });
    }
    loadfromStorage() {
        chrome.storage.local.get(['defaultDictionary'])
        .then((result) => {
            console.log(result, "result from storage")
            if(result.defaultDictionary && Array.isArray(result.defaultDictionary)) {
                backgroundLogger.log("dictionary loaded from storage");
                this.dictionaryWords = new Set(result.defaultDictionary);
            } else {
                backgroundLogger.log("no dictionary found in storage");
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }
}
const dictionaryManager = new DictionaryManager()

// if there is saved dictionary load 
chrome.storage.local.get(['defaultDictionary'], function(result) {//dictionary
    if(result.defaultDictionary) {
        dictionaryManager.loadfromStorage();
        backgroundLogger.log("dictionary loaded from storage");
    } else {
        backgroundLogger.log("no dictionary found in storage");
    }
});


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
    else if (request.type === "addToDic") {//dictionary
        backgroundLogger.log("word added to dictionary");
        console.log(`word added to dictionary: ${request.data}`);
        let word = request.data;
        dictionaryManager.addTodic(word);
        sendResponse({
            result: `succesfully added word ${word} to dictionary: from background script `,
        });
    } 
});

console.log("background script loaded");
