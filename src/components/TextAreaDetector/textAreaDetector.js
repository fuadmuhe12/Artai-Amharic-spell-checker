
//---------------------------------------------------------------------------------------------------------------------
// logger class
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


const logger  =  new Logger();
window.logger = logger;
console.log(logger);
//-------------------------------------------------------------------------------------------------------//-------------------------------------------------------------------------------------------------------------------

// Class for text area detector in web page
// ---------------------------------------------------------------------------------------------//-------------------------------------------------------------------------------------------------------------
// class Event
class Event{
    constructor(eventName, data=null){
        this.eventName = eventName;
        this.data = data;
    }
}
let Event_1_TextArea = new Event("TextAreaDetected");
let Event_2_Geez  = new Event("GeezScriptDetected");
let Event_3_Misspelled = new Event("MisspelledWordFound");
let Event_4_Suggestion = new Event("SuggestionSelected");
let Event_5_Interact = new Event("UserInteractedWithHighlightedWord");

// -------------------------------------------------------//---------------------------------------------------------------------------------------------------------------------------------------------------
// channel`s class
class channel{
    constructor(channelName, eventName){
        this.channelName = channelName;
        this.eventName = eventName;
        this.subscribers = [];
    }
}


listChannels = new Set();

let channel_1_TextArea = new channel("TextArea", Event_1_TextArea);
let channel_2_Geez  = new channel("GeezScript", Event_2_Geez);
let channel_3_Misspelled = new channel("MisspelledWord", Event_3_Misspelled);
let channel_4_Suggestion = new channel("Suggestion", Event_4_Suggestion);
let channel_5_Interact = new channel("Interact", Event_5_Interact);
// to the list of channels
listChannels.add(channel_1_TextArea);
listChannels.add(channel_2_Geez);
listChannels.add(channel_3_Misspelled);
listChannels.add(channel_4_Suggestion);
listChannels.add(channel_5_Interact);
console.log(listChannels);
// ------------------------------------------------//----------------------------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
//Evant Dispatcher class 
class EventDispatcher {
    channels = listChannels;

    subscribe(channelName, subscriber) {
        logger.info(`this.channels: ${this.channels} from the EventDispatcher class`);
        let channelFound = false;

        for (let element of this.channels) {
            if (element.channelName === channelName) {
                element.subscribers.push(subscriber);
                channelFound = true;
                break;
            }
            
        }

        if (!channelFound) {
            logger.warn(`No channel with name ${channelName}`);
        }
    }

    publishEvent(channelName, event) {
        let channelFound = false;

        for (let element of this.channels) {
            if (element.channelName === channelName) {
                channelFound = true;
                element.subscribers.forEach(function (subscriber) {
                    logger.info("Event handler is called");
                    subscriber.handleEvent(event);
                    // the handleEvent function should be implemented in the subscriber class
                });
                if (element.subscribers.length === 0){
                    logger.warn(`No subscribers for channel ${channelName}`);
                }
                break;
            }

        }

        if (!channelFound) {
            logger.warn(`No channel with name ${channelName}`);
        }
    }

    getChannelSubscribers(channelName) {
        return this.channels[channelName].subscribers;
    }
}


const EventDispatcherObj = new EventDispatcher();

//------------------------------//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// UserInterfaceManager class
class UserInterfaceManager {
    #spellcheckStatus = false;
    #textAreaList = [];
    #GeezScript = null;
    #misspelledWordList = {};
    spellcheckCommunicationManager =  "new SpellcheckCommunicationManager()";
    eventDispatcher = EventDispatcherObj;
    activateSpellcheck(){
        this.#spellcheckStatus = true;
    }
    deactivateSpellcheck(){
        this.#spellcheckStatus = false;
    }
    subscribeEvent(channel) {
        this.eventDispatcher.subscribe(channel, this);
      }
    publishEvent(payload) {
        this.eventDispatcher.publishEvent('UIEvent', payload);
    }
    handleEvent(event) {
        console.log("userinterafce manager , handle event started")
        //{ "DOM": this.textAreaList, "GeezScript": null }
        //{ type:"textArea", DOM: this.textAreaList, GeezScript: null }
        console.log("event is started");
        switch (event.type) {
            
            case "textArea":
                console.log("text area event is started");
                this.#textAreaList = event.DOM;
                const  textArea1 = this.#textAreaList[0];
                // initialize the spellcheck status
                this.#spellcheckStatus = true;
                // inject an image icon into the parent of text area
                const parent = textArea1.parentElement;
                const div = document.createElement('div');
                div.setAttribute('id', 'spellcheck-div');
                
                const icon = document.createElement('img');
                icon.setAttribute('src', 'https://cdn.icon-icons.com/icons2/2645/PNG/512/textarea_t_text_icon_159809.png');
                icon.setAttribute('id', 'spellcheck-icon');
                icon.setAttribute('title', 'Artie Amharic Spellcheck');
                icon.setAttribute('style', 'width: 20px; height: 20px; margin-left: 5px; cursor: pointer;');
                div.appendChild(icon);
                icon.addEventListener('mouseover', function() {
                    this.style.backgroundColor = 'lightgreen';
                });
                icon.addEventListener('mouseout', function() {
                    this.style.backgroundColor = '';
                });
                
                // icon_inner =  " <img src = 'https://cdn.icon-icons.com/icons2/2645/PNG/512/textarea_t_text_icon_159809.png' id='spellcheck-icon' title = 'Amharic Spellcheck'  /> "   
                // div.innerHTML = icon_inner;
                console.log(div, "div");
                parent.appendChild(div);
                console.log(parent, "parent");


                break;
            case "GeezScript":
                console.log("GeezScript event is started");
                // if GeezScript is detected, activate the spellcheck to send the text to the server
                this.#GeezScript = event.DOM;
                this.#GeezScript = true;
                console.log("GeezScript is detected and spellcheck is activated");

                
            
        }
        console.log("event is ended");

        

        
                
    }
    


}

const userInterfaceManager = new UserInterfaceManager();

userInterfaceManager.subscribeEvent("TextArea");
userInterfaceManager.subscribeEvent("GeezScript");
//---------------------------------------------//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//class for GeezScriptDetector

class GeezScriptDetector {
    #isGeezScript = false;
    #textAreaList = [];
    #previousText = ""; // Store the previous text
    eventDispatcher = EventDispatcherObj;

    constructor() {
        setInterval(() => {
            // Check if the text area's value has changed
            if (this.#textAreaList.length > 0 && this.#textAreaList[0].value !== this.#previousText) {
                this.#previousText = this.#textAreaList[0].value;

                this.#isGeezScript = this.isGeezScript(this.#previousText);
                if (this.#isGeezScript) {
                    logger.info("Amharic Geez script detected");
                    this.publishEvent("GeezScript", { type: "GeezScript", DOM: this.#textAreaList[0] });
                }
            }
        }, 3000); // Check every 3 seconds
    }

    isGeezScript(text) {
        const totalCharacters = text.replace(/\s/g, "").length; // Exclude whitespace characters
        let geezCharacters = 0;

        // Iterate through each character in the text
        for (let i = 0; i < text.length; i++) {
            // Check if the character is in the Amharic Geez script range
            if (/[\u1200-\u137F\u1380-\u139F\u2D80-\u2DDF]/.test(text[i])) {
                geezCharacters++;
            }
        }

        // Calculate the percentage of Amharic characters
        const percentage = (geezCharacters / totalCharacters) * 100;

        // Log the detection details
        logger.info(`Total Characters: ${totalCharacters}, Geez Characters: ${geezCharacters}, Percentage: ${percentage}%`);

        // Return true if 70% or more of the text is in Amharic script
        return percentage >= 70;
    }

    subscribeEvent(channel) {
        this.eventDispatcher.subscribe(channel, this);
    }

    publishEvent(channelName, payload) {
        if (channelName === "GeezScript") {
            this.eventDispatcher.publishEvent(channelName, payload);
            logger.info(`Geez  published Event to channel ${channelName}`);
        }
        else {
            logger.warn(`No channel with name ${channelName}`);
        }

       
    }

    handleEvent(event) {
        switch (event.type) {
            case "textArea":
                this.#textAreaList = event.DOM;
                const textArea1 = this.#textAreaList[0];
                const text = textArea1.value;
                this.#isGeezScript = this.isGeezScript(text);
                if (this.#isGeezScript) {
                    logger.info("Amharic Geez script detected");
                    this.publishEvent("GeezScript", { type: "GeezScript", DOM: this.#textAreaList[0] });
                }
                break;
        }
    }
}

const geezScriptDetector = new GeezScriptDetector();
geezScriptDetector.subscribeEvent("TextArea");



//---------------------------------------------//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
class TextAreaDetector {
    constructor() {
        this.textAreaList = [];
        window.onload = this.scanTextAreas.bind(this);
    }

    // Scan the web page and find all text areas
    scanTextAreas() {
        // If a text area has already been found, do not scan again
        if (this.textAreaList.length > 0) {
            return;
        }

        try {
            const textAreas = document.querySelectorAll('textarea');
            this.textAreaList = Array.from(textAreas);

            if (this.textAreaList.length > 0) {
                console.log(`Found ${this.textAreaList.length} text areas in the page`);
                console.log(this.textAreaList, "from textAreaDetector class");
                EventDispatcherObj.publishEvent("TextArea", { type:"textArea", DOM: this.textAreaList, GeezScript: null });
                console.log(EventDispatcherObj, 'from textAreaDetector class')
            } else {
                logger.info("No text areas in the page");
            }
        } catch (error) {
            logger.error(`Error during text area scanning: ${error.message}`);
        }
    }
}
const textAreaDetector = new TextAreaDetector();
const message = {
    type: "TextArea",
    data : textAreaDetector
}
console.log(logger);

//---------------------------------------------//-------------------------------------------------------------------------------------------------------------------------------------------------------------------


// sending log messages to the background script
// Send a message to the background script every 1 minute
setInterval(function() {
    chrome.runtime.sendMessage({command: "sendLogger", logger: logger.getLogMessages()}, function(response) {
        console.log(response.result);
    });
}, 10000); 
