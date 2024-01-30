//---------------------------------------------------------------------------------------------------------------------
// logger class
// Enum for log levels
let dataSentOnce = false;
// make the data sent once to be false every 3 seconds
setInterval(() => { dataSentOnce = false }, 3000);
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
        if (this.logMessages.length > 500) {
            this.logMessages = this.logMessages.slice(400, undefined)
        }

    }
}

const logger = new Logger();
window.logger = logger;
console.log(logger);
//-------------------------------------------------------------------------------------------------------//-------------------------------------------------------------------------------------------------------------------
const div = document.createElement("div");
div.setAttribute("id", "artai_main");
// shadow.appendChild(div);

document.documentElement.appendChild(div);
const element = document.getElementById("artai_main");

const shadow = element.attachShadow({ mode: "open" });

const shadowRoot = element.shadowRoot;

//==========================================================================================================================================================================================================
// add the css file to the shadow root
logger.info("adding a css file to the shadow root")
let linkElem = document.createElement('link');
linkElem.setAttribute('rel', 'stylesheet');
linkElem.setAttribute('href', 'Spell-Checking-Extension/src/styles/style.css');
shadowRoot.appendChild(linkElem);


//====================================//==========================================================================================================================================================================================================
//adding a tailwind link to the shadow root
//=======================================================================================================================================================================
console.log(shadowRoot, "shadowRoot");
logger.info("shadow root is created");
let div2 = document.createElement("div");


div2.setAttribute("id", "artai_full");
div2.style =
    "position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; ";
shadow.appendChild(div2);
const element2 = shadowRoot.querySelector("#artai_full");


//==========================================================================================================================================================================================================

// ፟===============================================================================================================================================================================================

// Class for text area detector in web page
// ---------------------------------------------------------------------------------------------//-------------------------------------------------------------------------------------------------------------
// class Event
class Event {
    constructor(eventName, data = null) {
        this.eventName = eventName;
        this.data = data;
    }
}
let Event_1_TextArea = new Event("TextAreaDetected");
let Event_2_Geez = new Event("GeezScriptDetected");
let Event_3_Misspelled = new Event("MisspelledWordFound");
let Event_4_Suggestion = new Event("SuggestionSelected");
let Event_5_Interact = new Event("UserInteractedWithHighlightedWord");

// -------------------------------------------------------//---------------------------------------------------------------------------------------------------------------------------------------------------
// channel`s class
class channel {
    constructor(channelName, eventName) {
        this.channelName = channelName;
        this.eventName = eventName;
        this.subscribers = [];
    }
}

listChannels = new Set();

let channel_1_TextArea = new channel("TextArea", Event_1_TextArea);
let channel_2_Geez = new channel("GeezScript", Event_2_Geez);
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
        logger.info(
            `this.channels: ${channelName} from the EventDispatcher class`
        );
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
        logger.info(`data is being published to channel ${channelName}`);
        
        for (let element of this.channels) {
            
            if (element.channelName === channelName) {
                channelFound = true;
                element.subscribers.forEach(function (subscriber) {
                    logger.info(
                        `Event is published to be handled by the channel ${channelName} `
                    );
                    
                    subscriber.handleEvent(event);
                    // the handleEvent function should be implemented in the subscriber class
                });
                if (element.subscribers.length === 0) {
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
        let channelFound = false;
        let subscribers = [];

        for (let element of this.channels) {
            if (element.channelName === channelName) {
                channelFound = true;
                subscribers = element.subscribers;
                break;
            }
        }

        if (!channelFound) {
            logger.warn(`No channel with name ${channelName}`);
        }

        return subscribers;
    }
}

const EventDispatcherObj = new EventDispatcher();



//------------------------------//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// UserInterfaceManager class
class UserInterfaceManager {
    #spellcheckStatus = false;
    #textAreaList = [];
    #GeezScript = null;
    #misspelledWordList = new Set();
    #suggestedList = []
    eventDispatcher = EventDispatcherObj;
    activateSpellcheck() {
        this.#spellcheckStatus = true;
    }
    deactivateSpellcheck() {
        this.#spellcheckStatus = false;
    }
    subscribeEvent(channel) {
        this.eventDispatcher.subscribe(channel, this);
    }
    publishEvent(payload, channelName) {
        this.eventDispatcher.publishEvent(channelName, payload);
    }
    handleEvent(event) {
        console.log("userinterafce manager , handle event started");
        //{ "DOM": this.textAreaList, "GeezScript": null }
        //{ type:"textArea", DOM: this.textAreaList, GeezScript: null }
        console.log("event is started");
        switch (event.type) {
            case "textArea":
                console.log("text area event is started");
                logger.info("text area is detected and spellcheck is activated");
                this.#textAreaList = event.DOM;
                const textArea1 = this.#textAreaList[0];
                // initialize the spellcheck status
                this.#spellcheckStatus = true;
                // inject an image icon into the parent of text area
                const parent = textArea1.parentElement;






                console.log(div, "div");

                console.log(parent, "parent");

                break;
            case "GeezScript":
                logger.info( `UIM recieded GeezScript , ready to send the text to the server for scanning : UMI line 262`);
                // I want the data  to be sent only if  the sentdata is false

                console.log("sending the geez @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",this.#textAreaList[0].value) 

                // if GeezScript is detected, activate the spellcheck to send the text to the server
                this.#GeezScript = event.DOM;
                this.#GeezScript = true;


                let textToBeSent = this.#textAreaList[0].value; // for scanning

                this.sendToCommunicationManager(textToBeSent);
                // send the text to the server for scanning
                dataSentOnce = true;

                break;
        }
    }
    sendToCommunicationManager(text) {
        let message = {
            type: "textforScanning",
            data: text,
        };


        logger.info("sending text to communication manager found in background script to scan the text:  UIM/ sendToCommunicationManager function line 288");
        chrome.runtime.sendMessage(message, function (response) {
            logger.info(
                `reponse from background script from recieving text for analysis : ${response.result} , : UIM/ sendToCommunicationManager function line 291`
            );
        });
        chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
            if (message.type === "correctedText") {
                sendResponse({ result: "Corrected text succesfully  recieved by content script :UIM " });
                // send to the user interface manager
                // TODO: send the recieved data to the correct place
                logger.info("corrected text is recieved by content script from background script: UIM/sendToCommunicationManager line 299");

                userInterfaceManager.recieveMessageFromCommunicationManager(message.correctedText.result);
            }
        });
    }

    recieveMessageFromCommunicationManager(result) {
        logger.info("publishing recieved data from background script: UIM/recieveMessageFromCommunicationManager line 307  ");
        console.log(result, "result from UIM class line: 308")
        let sentText = result.text;
        let receivedErrors = result.errors;
        this.#misspelledWordList.clear();
        this.#suggestedList = []

        for (let error of receivedErrors) {
            this.#misspelledWordList.add(error.word);
            this.#suggestedList.push(error.suggestions)
        }
        // handle the postimg of the misspelled words

        let messageForMisspelled = {
            DOM: this.#textAreaList,
            type: "MisspelledWord and suggestion",
            misspelledData: this.#misspelledWordList,
            suggestionData: this.#suggestedList
        };// this to be highlited 


        let messageForSuggestion = {
            //for to be decided
            DOM: this.#textAreaList,
            type: "Suggestion",
            data: this.#suggestedList,
        };
        this.publishEvent(messageForMisspelled, "MisspelledWord")
        this.publishEvent(messageForSuggestion, "Suggestion")
        result = ""
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
            if (
                this.#textAreaList.length > 0 &&
                this.#textAreaList[0].value !== this.#previousText
            ) {
                this.#previousText = this.#textAreaList[0].value;

                this.#isGeezScript = this.isGeezScript(this.#previousText);
                if (this.#isGeezScript) {
                    logger.info("Amharic Geez script detected");
                    this.publishEvent("GeezScript", {
                        type: "GeezScript",
                        DOM: this.#textAreaList[0],
                    });
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
        logger.info(
            `Total Characters: ${totalCharacters}, Geez Characters: ${geezCharacters}, Percentage: ${percentage}%`
        );

        // Return true if 70% or more of the text is in Amharic script
        return percentage >= 70;
    }

    subscribeEvent(channel) {
        this.eventDispatcher.subscribe(channel, this);
    }

    publishEvent(channelName, payload) {
        if (channelName === "GeezScript") {
            this.eventDispatcher.publishEvent(channelName, payload);
            logger.info(`Geez class  is publishing Event to channel ${channelName} saying geezFound , line: 404`);
        } else {
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
                    logger.info("Amharic Geez script detected from handle event of GeezScriptDetector class line: 418");
                    this.publishEvent("GeezScript", {
                        type: "GeezScript",
                        DOM: this.#textAreaList[0],
                    });
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
            const textAreas = document.querySelectorAll("textarea");
            this.textAreaList = textAreas;// made a change here from Array.from(textAreas); to textAreas

            if (this.textAreaList.length > 0) {
                //=================================================================================================================================================================================================================
                let textArea = this.textAreaList[0];
                textArea.value = "እኛ አለን እና ሰዎች ናቸው ። ድቭድፍቭ ሰዎች እና አሉ።";
                let textAreaPos = textArea.getBoundingClientRect()
                logger.info("creating the shadow root for text area: inside TextAreaDetector function");
                let div3 = document.createElement("div");
                div3.setAttribute("id", "textarea");
                let logo = document.createElement("img");
                logo.setAttribute("src", "https://cdn.icon-icons.com/icons2/2645/PNG/512/textarea_t_text_icon_159809.png");
                logo.setAttribute("id", "spellcheck-icon");
                logo.setAttribute("title", "Artie Amharic Spellcheck");
                logo.setAttribute("style", `width: 20px; height: 20px; margin-left: 5px; cursor: pointer; position: absolute; top: ${textAreaPos.top + textAreaPos.height - 30}px; left: ${textAreaPos.left + textAreaPos.width - 33}px; `);
                shadowRoot.appendChild(logo);
                

                logo.addEventListener("mouseover", function () {
                    //add the hover effect and scale up
                    logo.style.transform = "scale(1.2)";
                    logo.style.transition = "transform 0.5s";
                    logo.style.backgroundColor = "rgb(31, 198, 101)";

                });

                logo.addEventListener("mouseout", function () {
                    //remove the hover effect and scale down
                    logo.style.transform = "scale(1)";

                    logo.style.backgroundColor = "";
                });
                

                let scrollTop_ = window.pageYOffset || document.documentElement.scrollTop;
                let scrollLeft_ = window.pageXOffset || document.documentElement.scrollLeft;
                console.log(textAreaPos, "text area posotion from textAreaDetector class")
                div3.style = ` top: ${textAreaPos.top+scrollTop_}px; left: ${textAreaPos.left+scrollLeft_}px; width: ${textAreaPos.width}px; height: ${textAreaPos.height}px;box-sizing: content-box;  position: relative; pointer-events: none; overflow: hidden; border: 0px; border-radius: 0px; padding: 0px; margin: 0px;`;
                element2.appendChild(div3);

                const element3 = shadowRoot.querySelector("#textarea")
                var divs = document.createElement("div");
                divs.style = "position: absolute; top: 0px; left: 0px; height: 700px; width: 1500px; "
                divs.setAttribute("id", "artai_misspelles_words_store")
                console.log(divs)
                element3.appendChild(divs)
                const element4 = shadowRoot.querySelector("#artai_misspelles_words_store")
                
                //===============================================================================================================================================================================================
                console.log(`Found ${this.textAreaList.length} text areas in the page`);
                console.log(this.textAreaList, "from textAreaDetector class");
                
                EventDispatcherObj.publishEvent("TextArea", {
                    type: "textArea",
                    DOM: this.textAreaList,
                    GeezScript: null,
                });
                
                
                console.log(EventDispatcherObj, "from textAreaDetector class");
            } else {
                logger.info("No text areas in the page");
            }
        } catch (error) {
            logger.error(`Error during text area scanning: ${error.message}`);
        }
    }
}
const textAreaDetector = new TextAreaDetector();


//---------------------------------------------//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
// misspelled word highlighter class
class HighlighterManager {
    #misspelledWordList = new Set();
    #suggestedList = []
    #textAreaList = [];
    element = element;
    element2 = element2;
    shadowRoot = shadowRoot;
    element3;
    element4;


    //===========================================================================================================================================================================================================

    //===========================================================================================================================================================================================================

    highlight() {
        //===============================================================================================================================================================================================
        //main function 




        (function () {
            // We'll copy the properties below into the mirror div.
            // Note that some browsers, such as Firefox, do not concatenate properties
            // into their shorthand (e.g. padding-top, padding-bottom etc. -> padding),
            // so we have to list every single property explicitly.
            var properties = [
                "direction", // RTL support
                "boxSizing",
                "width", // on Chrome and IE, exclude the scrollbar, so the mirror div wraps exactly as the textarea does
                "height",
                "overflowX",
                "overflowY", // copy the scrollbar for IE

                "borderTopWidth",
                "borderRightWidth",
                "borderBottomWidth",
                "borderLeftWidth",
                "borderStyle",

                "paddingTop",
                "paddingRight",
                "paddingBottom",
                "paddingLeft",

                // https://developer.mozilla.org/en-US/docs/Web/CSS/font
                "fontStyle",
                "fontVariant",
                "fontWeight",
                "fontStretch",
                "fontSize",
                "fontSizeAdjust",
                "lineHeight",
                "fontFamily",

                "textAlign",
                "textTransform",
                "textIndent",
                "textDecoration", // might not make a difference, but better be safe

                "letterSpacing",
                "wordSpacing",

                "tabSize",
                "MozTabSize",
            ];

            var isBrowser = typeof window !== "undefined";
            var isFirefox = isBrowser && window.mozInnerScreenX != null;

            function getCaretCoordinates(element, position, options) {
                if (!isBrowser) {
                    throw new Error(
                        "textarea-caret-position#getCaretCoordinates should only be called in a browser"
                    );
                }

                var debug = (options && options.debug) || false;
                if (debug) {
                    var el = document.querySelector(
                        "#input-textarea-caret-position-mirror-div"
                    );
                    if (el) el.parentNode.removeChild(el);
                }

                // The mirror div will replicate the textarea's style
                var div = document.createElement("div");
                div.id = "input-textarea-caret-position-mirror-div";
                document.body.appendChild(div);

                var style = div.style;
                var computed = window.getComputedStyle
                    ? window.getComputedStyle(element)
                    : element.currentStyle; // currentStyle for IE < 9
                var isInput = element.nodeName === "INPUT";

                // Default textarea styles
                style.whiteSpace = "pre-wrap";
                if (!isInput) style.wordWrap = "break-word"; // only for textarea-s

                // Position off-screen
                style.position = "absolute"; // required to return coordinates properly
                // not 'display: none' because we want rendering

                // Transfer the element's properties to the div
                properties.forEach(function (prop) {
                    if (isInput && prop === "lineHeight") {
                        // Special case for <input>s because text is rendered centered and line height may be != height
                        if (computed.boxSizing === "border-box") {
                            var height = parseInt(computed.height);
                            var outerHeight =
                                parseInt(computed.paddingTop) +
                                parseInt(computed.paddingBottom) +
                                parseInt(computed.borderTopWidth) +
                                parseInt(computed.borderBottomWidth);
                            var targetHeight = outerHeight + parseInt(computed.lineHeight);
                            if (height > targetHeight) {
                                style.lineHeight = height - outerHeight + "px";
                            } else if (height === targetHeight) {
                                style.lineHeight = computed.lineHeight;
                            } else {
                                style.lineHeight = 0;
                            }
                        } else {
                            style.lineHeight = computed.height;
                        }
                    } else {
                        style[prop] = computed[prop];
                    }
                });

                if (isFirefox) {
                    // Firefox lies about the overflow property for textareas: https://bugzilla.mozilla.org/show_bug.cgi?id=984275
                    if (element.scrollHeight > parseInt(computed.height))
                        style.overflowY = "scroll";
                } else {
                    style.overflow = "hidden"; // for Chrome to not render a scrollbar; IE keeps overflowY = 'scroll'
                }


                div.textContent = element.value.substring(0, position);
                // The second special handling for input type="text" vs textarea:
                // spaces need to be replaced with non-breaking spaces - http://stackoverflow.com/a/13402035/1269037
                if (isInput)
                    div.textContent = div.textContent.replace(/\s/g, "\u00a0");

                var span = document.createElement("span");
                // Wrapping must be replicated *exactly*, including when a long word gets
                // onto the next line, with whitespace at the end of the line before (#7).
                // The  *only* reliable way to do that is to copy the *entire* rest of the
                // textarea's content into the <span> created at the caret position.
                // For inputs, just '.' would be enough, but no need to bother.
                span.textContent = element.value.substring(position) || "."; // || because a completely empty faux span doesn't render at all
                div.appendChild(span);

                var coordinates = {
                    top: span.offsetTop + parseInt(computed["borderTopWidth"]),
                    left: span.offsetLeft + parseInt(computed["borderLeftWidth"]),
                    height: parseInt(computed["lineHeight"]),
                };

                if (debug) {
                    span.style.backgroundColor = "#aaa";
                } else {
                    document.body.removeChild(div);
                }

                return {
                    coordinates: coordinates,
                    div: div,
                };
            }

            if (
                typeof module != "undefined" &&
                typeof module.exports != "undefined"
            ) {
                module.exports = getCaretCoordinates;
            } else if (isBrowser) {
                window.getCaretCoordinates = getCaretCoordinates;
            }
        })();

        ////===============================================================================================================================================================================================

        //===============================================================================================================================================================================================
        // log evry momoment for debuuig
        logger.info("highlighter is activated: now inside highlight function");
        let text_Area = this.#textAreaList[0];
        // if the text Area is defined
        if (text_Area !== undefined) {
            let misspelled_words = this.#misspelledWordList;
            if (misspelled_words.size === 0) {
                logger.info("No misspelled words to highlight");
                element4.innerHTML = "";
                return;
            } else {
                logger.info("Misspelled words are found and highlighter is activated");
            }

            let text_AreaPos = text_Area.getBoundingClientRect();

            logger.info(
                "creating the divs for misspelled words: inside highlight function"
            );

            // create a div to host misspelled words
            //=====================================================================================================================================================================================================
            let div3 = document.createElement("div");
            div3.setAttribute("id", "textarea");

            div3.style = ` top: ${text_AreaPos.top}px; left: ${text_AreaPos.left}px; width: ${text_AreaPos.width}px; height: ${text_AreaPos.height}px;box-sizing: content-box;  position: relative; pointer-events: none; overflow: hidden; border: 0px; border-radius: 0px; padding: 0px; margin: 0px;`;
            //check if there is no the div with the same id
            if (shadowRoot.querySelector("#textarea") === null) {
                element2.appendChild(div3);
            }

            // Finding the text area place where the misspelled words will be highlighted

            this.element3 = shadowRoot.querySelector("#textarea");
            var divs = document.createElement("div");
            divs.style =
                "position: absolute; top: 0px; left: 0px; height: 700px; width: 1500px; ";
            divs.setAttribute("id", "artai_misspelles_words_store");
            if (shadowRoot.querySelector("#artai_misspelles_words_store") == null) {
                element3.appendChild(divs);
            }

            // place where the div of misspelled words will be stored
            // console.log('This is fine')
            this.element4 = shadowRoot.querySelector(
                "#artai_misspelles_words_store"
            );
            // ===============================================================================================================================================================================================
            logger.info(
                "divs for misspelled store created: inside highlight function: next is problem place!!!"
            );
            logger.info("creating the divs: for mirrowr : inside highlight function");
            let diq = document.createElement("div");
            diq.id = "diq";
            // if diq is not in the body add it

            diq.style = "position: absolute; opacity: 0; pointer-events: none; z-index: -9999; top: 0px; left: 0px; "
            document.querySelectorAll("#diq").forEach(function (thDiv, index) {
                thDiv.remove();
                if (index < document.querySelectorAll("#diq").length - 1) {
                    diq.remove();
                }
            })
            document.body.appendChild(diq);
            logger.info("start of change function: inside highlight function");
            //===========================================================================================================================================================================================================


            function change() {
                text_AreaPos = text_Area.getBoundingClientRect();
                let scrollTop__ = window.pageYOffset || document.documentElement.scrollTop;
                let scrollLeft__ = window.pageXOffset || document.documentElement.scrollLeft;
                console.log(text_AreaPos, "text area posotion from highlight function")
                highlighterManager.element3.style = `top: ${text_AreaPos.top+scrollTop__}px; left: ${text_AreaPos.left+scrollLeft__}px; width: ${text_AreaPos.width}px; height: ${text_AreaPos.height}px;box-sizing: content-box;  position: relative; pointer-events: none; overflow: hidden; border: 0px; border-radius: 0px; padding: 0px; margin: 0px;`;

                highlighterManager.element4.innerHTML = ""
                //up date the  posision of  logo icon
                let logo = shadowRoot.querySelector("#spellcheck-icon");
                logo.style = `width: 20px; height: 20px; margin-left: 5px; cursor: pointer; position: absolute; top: ${text_AreaPos.top + text_AreaPos.height - 30}px; left: ${text_AreaPos.left + text_AreaPos.width - 33}px; `;



                console.log(getCaretCoordinates(text_Area, text_Area.selectionStart).div, "the mirro sfvsfdvsfdv r")
                text_Area = highlighterManager.#textAreaList[0];
                let mirror = getCaretCoordinates(text_Area, text_Area.selectionStart).div
                console.log(mirror, "the mirror")
                if (diq.textContent !== mirror.textContent) {
                    diq.textContent = mirror.textContent;
                }


                for (let property of mirror.style) {
                    diq.style[property] = mirror.style[property];
                }

                console.log(diq, "the diq")
                const vals = highlighterManager.getTextNodeMetrics(diq, misspelled_words)// get the position of each word in the text area
                console.log(vals, "vals")
                for (let word = 0; word < vals.length; word++) {

                    highlighterManager.create_misspelled_divs(vals[word], highlighterManager.#suggestedList[word]) // create the divs for each misspelled word to be hightlited and also their suggestion
                }
            }

            ////===========================================================================================================================================================================================================
            logger.info("end of change function: inside highlight function");
            // Callback function to be executed when textarea size changes
            logger.info("start of resize observer: inside highlight function");
            // Create a ResizeObserver with the callback function
            const resizeObserver = new ResizeObserver(change);

            // Start observing the textarea for size changes
            resizeObserver.observe(text_Area);

            // Event listener for text input
            text_Area.addEventListener("input", change);
            logger.info("end of resize observer: inside highlight function");
            // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        } else {
            logger.warn("No text area is found");
        }
    }
    // ===============================================================================================================================================================================================
    // set of misspled words tobe highlighted

    create_misspelled_divs(name, suggestionList) {


        logger.info(
            "creating the divs for misspelled to be highlighted and also their sugggestion: inside create_misspelled_divs function"
        );
        // name is each word in the text area that are misspelled with their position
        let misspelled_hub = document.createElement("div")
        misspelled_hub.style.pointerEvents = "auto";
        misspelled_hub.style.zIndex = "1000";
        misspelled_hub.style = "width:100%; height:100%;"

        misspelled_hub.id = `artai_misspelled_hub${name.ID}`
        if (
            shadowRoot.querySelector(`#artai_misspelled_hub${name.ID}`) === null
        ) {
            highlighterManager.element4.appendChild(misspelled_hub);
        }
        let element5 = shadowRoot.querySelector(
            `#artai_misspelled_hub${name.ID}`
        );



        let misspelled_word = document.createElement("div");

        misspelled_word.classList.add("highlight_red");
        misspelled_word.dataset.misspelled = 'misspelled';
        misspelled_word.id = `artai_misspelled_word${name.ID}`;
        misspelled_word.setAttribute('data-misspelledPlace', `${name.ID}`) // place of the word only from the misspelled words 
        misspelled_word.setAttribute('data-wordPlace', `${name.word_ID}`) // place of the word from all of the word 
        misspelled_word.style = `top: ${name.top}px; left: ${name.left}px; width: ${name.width}px; height: ${name.height}px; border-bottom: 2px solid red; position: absolute; `;
        misspelled_word.style.pointerEvents = "auto";
        misspelled_word.style.zIndex = "1000";
        // if the misspelled word div with id of misspelled_word already there dont' add
        if (
            shadowRoot.querySelector(`#artai_misspelled_word${name.ID}`) === null
        ) {
            element5.appendChild(misspelled_word);
        }


        let suggestion_div = document.createElement("div");
        // show the suggestion in absolute position below the word, without any space separation between the two
        suggestion_div.style = `position:fixed; top: ${name.top + name.height + 10}px; left: ${name.left - 10}px; `
        suggestion_div.style.display = "none";
        suggestion_div.style.zIndex = "99999";
        suggestion_div.dataset.suggestion = 'suggestion'
        suggestion_div.dataset.suggestionPlace = `${name.ID}`;
        suggestion_div.id = `artai_suggestion${name.ID}`;
        suggestion_div.classList.add("suggestion_div");
        suggestion_div.innerHTML = '<div class="text p-4 bg-white border  text-gray-500 shadow-md max-w-fit flex flex-col rounded-xl"  >' +
            '<div class="title text-lg font-bold px-5 mb-4">Correct your spelling</div>' +
            '<ul class="text-center flex flex-col">' +
            '</ul>' +
            '<div class="flex flex-col gap-5 justify-between items-start mt-6">' +
            '<div class="flex ">' +
            '<span class="flex" id="add_to_dic">' +
            '<img src="Spell-Checking-Extension/src/Icons/add_to_dic.png" alt="add_to_dic" class="mr-2 size-10">' +
            '<button class="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold px-2 px- rounded" id="replace">Add to Dictionary</button>' +
            '</span>' +
            '</div>' +
            '<div class="mx-auto my-3 ">' +
            '<a class="btn btn-primary bg-teal-600 hover:bg-teal-800 text-white font-bold py-2 px-2 rounded" id="ignore">See more about Artai</a>' +
            '</div>' +
            '</div>' +
            '</div>';
        suggestion_div.style.pointerEvents = "auto";
        let ul = suggestion_div.querySelector('.text-center');
        if (highlighterManager.#suggestedList.length > 0) {
            let num = 0;
            console.log(highlighterManager.#suggestedList, "highlighterManager.#suggestedList")

            if (highlighterManager.#suggestedList[name.ID].length > 0) {
                highlighterManager.#suggestedList[name.ID].forEach((suggestion) => {
                    let li = document.createElement('button');
                    li.className = 'text-2xl hover:bg-sky-200 hover:text-black-950   rounded-lg font-mono ';
                    li.id = `${num}`
                    li.dataset.wordPlace = `${name.word_ID}`
                    li.dataset.suggestionWord = "True"
                    li.dataset.suggestionPlace = `${name.ID}`;
                    li.textContent = suggestion;
                    ul.appendChild(li);

                    num += 1;
                });
            }
            else {
                //no suugestion 
                let li = document.createElement('li');
                li.className = 'text-2xl hover:bg-sky-200 hover:text-black-950   rounded-lg font-mono ';
                li.textContent = "No suggestion";
                ul.appendChild(li);

            }

        }


        if (
            shadowRoot.querySelector(`#artai_suggestion${name.ID}`) === null
        ) {
            element5.appendChild(suggestion_div);
        }

        //add event listener to the for mouse hover


        // Initialize a flag to track whether the mouse is over either element

        // Add 'mouseover' and 'mouseout' event listeners to the misspelled_word element
        let isWord = false;
        let issuggestion = false;

        misspelled_word.addEventListener('mouseenter', function () {
            isWord = true;
            suggestionsManager.displaySuggesion(name.ID);
            misspelled_word.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';

        });

        misspelled_word.addEventListener('mouseleave', function () {
            isWord = false;
            setTimeout(function () {
                if (!isWord && !issuggestion) {
                    misspelled_word.style.backgroundColor = '';
                    suggestionsManager.hideSuggesion(name.ID);
                }
            }, 100);
        }
        );

        suggestion_div.addEventListener('mouseenter', function () {
            issuggestion = true;
        });

        suggestion_div.addEventListener('mouseleave', function () {
            issuggestion = false;
            setTimeout(function () {
                if (!isWord && !issuggestion) {
                    misspelled_word.style.backgroundColor = '';
                    suggestionsManager.hideSuggesion(name.ID);
                }
            }, 100);

        });

    }
    //===========================================================================================================================================================================================================
    //======//===========================================================================================================================================================================================================
    getTextNodeMetrics(element, words_need) {
        const words = element.innerText.split(/(\s+)/);
        console.log(words, " inside position the list text inside text area")
        const metrics = []; // Initialize as an array
        let divRect = element.getBoundingClientRect(); // Get the div's position
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        console.log(scrollLeft, "scrollLeft")
        console.log(scrollTop, "scrollTop")
        console.log(divRect, "divRect")
        // divRect.top += scrollTop; // Add the scroll top
        // divRect.left += scrollLeft; // Add the scroll left
        console.log(divRect, "the text area position relative to the document")
        let id = 0;
        let word_ID = 0;
        words.forEach((word, index) => {
            if (words_need.has(word)) {
                const range = document.createRange();
                range.setStart(element.firstChild, words.slice(0, index).join('').length);
                range.setEnd(element.firstChild, words.slice(0, index + 1).join('').length)
                const rect = range.getBoundingClientRect();
                metrics.push({
                    ID: id,
                    word_ID: word_ID,
                    word: word,
                    top: rect.top - (divRect.top ), // Subtract the div's top
                    left: rect.left - (divRect.left), // Subtract the div's left
                    width: rect.width,
                    height: rect.height
                });
                id += 1 // to keep track only misspelled words  
            }
            word_ID += 1 // keep track of each word in the text area 
        });

        return metrics;
    }
    ////===========================================================================================================================================================================================================

    removehighlight(word, place, index) {
        // delete the wordlist from the set
        logger.info(`removing the word ${word} and suggestion  from the misspelled word list: inside removehighlight function line:1003`)
        logger.info(`suggestedList before removing ${this.#suggestedList} : inside removehighlight function line:1004`)
        console.log(this.#suggestedList, `suggestion before removing --------------------------- inside hightligt`)
        this.#suggestedList.splice(index, 1) // remove the suggestion from the list
        console.log(this.#suggestedList, "after removing the suggestion-------------------------------- inside highlight")
        logger.info(`suggestedList after removing ${this.#suggestedList} : inside removehighlight function line:1006`)

        this.#misspelledWordList.delete(word);
        const words = this.#textAreaList[0].value.split(/(\s+)/);
        words[place] = word;
        this.#textAreaList[0].value = words.join('');
        // remove the divs from the shadow root
        console.log(index, "index from suggestion---------------------------------- ")

        this.highlight();
    }
    subscribeEvent(channel) {
        EventDispatcherObj.subscribe(channel, this);
    }
    handleEvent(event) {
        /* messageFormat = {
             type: "the type of the event",
             data: "the data of the event",
             DOM: "the DOM of the event",
         }
         */
        logger.info(`highlighter manager is handling the event ${event.type} `);
        console.log(event, "event from highlighter manager");
        switch (event.type) {
            case "MisspelledWord and suggestion":
                logger.info("Misspelled word is received from the server and highlight is activated: from highlighterManager event handler");
                this.#textAreaList = event.DOM;
                this.#misspelledWordList = event.misspelledData;
                this.#suggestedList = event.suggestionData;
                console.log(this.#misspelledWordList, "this.#misspelledWordList from highlighter manager")
                console.log(this.#suggestedList, "this.#suggestedList from highlighter manager")
                this.highlight();
                break;
            case "SuggestionSelected":
                logger.info(
                    `suggestion is selected by user and selected word : ${event.data}`
                );
                this.removehighlight(event.data);
                break;
        }
        logger.info(
            `highlighter manager has finished handling the event ${event.type} `
        );
    }
}
const highlighterManager = new HighlighterManager();
highlighterManager.subscribeEvent("MisspelledWord");


//----------------------------------------------------------------------------------------------------//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// class for suggestion manager
class SuggestionsManager {
    #suggestionList = [];

    showSuggestions() {
        logger.info("suggesion manager is activated: now inside showSuggestions function");
        // if (this.#suggestionList.length > 0) {
        //     logger.info("adding  listener to the shadow root: inside showSuggestions function");

        //     // Get all elements with class 'misspleledWord'
        //     const misspelledWordsForsuggesion = shadowRoot.querySelectorAll('[data-misspelled="misspelled"]');;
        //     console.log(misspelledWordsForsuggesion, "misspelledWordsForsuggesion from suggestion manager")
        //     // Add event listeners to each 'misspleledWord' element
        //     for (let index = 0; index < misspelledWordsForsuggesion.length; index++) {
        //         shadowRoot.getElementById(`#artai_misspelled_word${index}`).addEventListener('mouseover', function () {
        //             suggestionsManager.displaySuggesion(index);
        //             console.log(misspleledWord,index, "index")
        //             //  add event to the parent of the event 

        //         });
        //         //  add event to the parent of the event 
        //         shadowRoot.getElementById(`#artai_misspelled_word${index}`).parentElement.addEventListener('mouseout', function () {
        //             suggestionsManager.hideSuggesion(index)
        //         })
        //     };
        // }
        // else {
        //     logger.warn("No suggestion to show")
        // }

    }
    displaySuggesion(num) {
        logger.info("showsuggestin function is activated: inside showSuggestions function");
        const artai_suggestion = shadowRoot.getElementById(`artai_suggestion${num}`);
        artai_suggestion.style.display = 'block';
        artai_suggestion.addEventListener('click', function (event) {
            // if the click element has data-suggestionWord True replace the word with the suggestion
            if (event.target.dataset.suggestionWord === "True") {
                logger.info(`suggestion is selected by user and selected word : ${event.target.textContent}`)
                let place = Number(event.target.dataset.wordPlace)
                let index = Number(event.target.dataset.suggestionPlace)
                let word = event.target.textContent
                console.log(suggestionsManager.#suggestionList, "before removing suggestion ################### inside suggestion manger")
                //suggestionsManager.#suggestionList.splice(index,1)

                highlighterManager.removehighlight(word, place, index)
                console.log(suggestionsManager.#suggestionList, "index from suggestion#################################3   inside suggestion manager- ")

                console.log(suggestionsManager.#suggestionList, "suggestionsManager.#suggestionList after removing the word")
            }
        });
    }

    hideSuggesion(num) {
        logger.info("hidesuggestin function is activated: inside showSuggestions function");
        const artai_suggestion = shadowRoot.getElementById(`artai_suggestion${num}`);
        artai_suggestion.style.display = 'none';
    }
    subscribeEvent(channel) {
        EventDispatcherObj.subscribe(channel, this);
    }
    handleEvent(event) {
        logger.info(`event is recieved by suggestion manager: ${event.type}`);
        switch (event.type) {
            case "Suggestion":
                logger.info("suggestion is recieved from the server: from suggestionManager event handler");
                this.#suggestionList = event.data;
                this.showSuggestions()

        }

    }

}

const suggestionsManager = new SuggestionsManager();
suggestionsManager.subscribeEvent("Suggestion");


//- --------------------------------------------------------------------------------------------------//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// sending log messages to the background script
// Send a message to the background script every 1 minute


setInterval(function () {
    chrome.runtime.sendMessage(
        { type: "sendLogger", logger: logger.getLogMessages() },
        function (response) {
            console.log(response.result);
        }
    );
    // Clear the log messages
    logger.clearLogMessages();
}, 10000);

// --------------------------------------------------------------------------------------------------//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

console.log(EventDispatcherObj.channels, "channels--------------------------------------------------");
console.log(EventDispatcherObj.getChannelSubscribers("Suggesion"), "sugetion channel subscribers--------------------------------------------------");
console.log(EventDispatcherObj.getChannelSubscribers("MisspelledWord"), "MisspelledWord channel subscribers----------------------------------------");




