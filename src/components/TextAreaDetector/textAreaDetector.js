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
        if (this.logMessages.length > 500){
            this.logMessages = this.logMessages.slice(400,undefined)
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

document.lastChild.appendChild(div);
const element = document.getElementById("artai_main");

const shadow = element.attachShadow({ mode: "open" });

const shadowRoot = element.shadowRoot;
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
            `this.channels: ${this.channels.channelName} from the EventDispatcher class`
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

        for (let element of this.channels) {
            if (element.channelName === channelName) {
                channelFound = true;
                element.subscribers.forEach(function (subscriber) {
                    logger.info(
                        `Event is published is published to handle the channel ${channelName} `
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
    #misspelledWordList = new Set();
    #suggestedList  = []
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
    publishEvent(payload) {
        this.eventDispatcher.publishEvent("MisspelledWord", payload);
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
                const div = document.createElement("div");
                div.setAttribute("id", "spellcheck-div");

                const icon = document.createElement("img");
                icon.setAttribute(
                    "src",
                    "https://cdn.icon-icons.com/icons2/2645/PNG/512/textarea_t_text_icon_159809.png"
                );
                icon.setAttribute("id", "spellcheck-icon");
                icon.setAttribute("title", "Artie Amharic Spellcheck");
                icon.setAttribute(
                    "style",
                    "width: 20px; height: 20px; margin-left: 5px; cursor: pointer;"
                );
                div.appendChild(icon);
                icon.addEventListener("mouseover", function () {
                    this.style.backgroundColor = "lightgreen";
                });
                icon.addEventListener("mouseout", function () {
                    this.style.backgroundColor = "";
                });

                // icon_inner =  " <img src = 'https://cdn.icon-icons.com/icons2/2645/PNG/512/textarea_t_text_icon_159809.png' id='spellcheck-icon' title = 'Amharic Spellcheck'  /> "
                // div.innerHTML = icon_inner;
                console.log(div, "div");
                parent.appendChild(div);
                console.log(parent, "parent");

                break;
            case "GeezScript":
                logger.info(
                    "GeezScript is detected and spellcheck is activated: from userInterfaceManager class"
                );
                // if GeezScript is detected, activate the spellcheck to send the text to the server
                this.#GeezScript = event.DOM;
                this.#GeezScript = true;
                logger.info(
                    `Text is about to be sent to the backgroung script for analysing`
                );
              this.sendToCommunicationManager()
        }
    }
    sendToCommunicationManager(text) {
        let message = {
            type: "textforScanning",
            data: text,
        };
        logger.info("sending text to communication manager to scan the text");
        chrome.runtime.sendMessage(message, function (response) {
            logger.info(
                `recieved response from communication manager: ${response.result}`
            );
        });
    }
    recieveMessageFromCommunicationManager(result) {
        let sentText = result.text;
        let receivedErrors = result.errors;
        this.#misspelledWordList.clear();
        this.#suggestedList = []

        for(let error of receivedErrors){
           this.#misspelledWordList.add(error.word);
           this.#suggestedList.push(error.suggestions)
        }
        // handle the postimg of the misspelled words
        // TODO: implement this function


        
    }
}

const userInterfaceManager = new UserInterfaceManager();

userInterfaceManager.subscribeEvent("TextArea");
userInterfaceManager.subscribeEvent("GeezScript");
userInterfaceManager.recieveMessageFromCommunicationManager();
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
            logger.info(`Geez  published Event to channel ${channelName}`);
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
                    logger.info("Amharic Geez script detected");
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
                let textArea1 = this.textAreaList[0];
                textArea1.value = "አማርኛ አማርኛ  ok yes no ok y n why what where";
                console.log(textArea1, "text area 1 from textAreaDetector class to get the position of the words")
                highlighterManager.getTextNodeMetrics(textArea1, new Set(["አማርኛ", "አማርኛ", "hello", "how", "ok", "yes", "no", "ok", "y", "n", "why", "what", "where", "when", "how", "who", "this", "that", "these", "those", "here", "there", "which", "whose", "whom", "why", "what", "where", "when", "how", "who", "this", "that", "these", "those", "here", "there", "which", "whose", "whom", "why", "what", "where", "when", "how", "who", "this", "that", "these", "those", "here", "there", "which", "whose", "whom", "why", "what", "where", "when", "how", "who", "this", "that", "these", "those", "here", "there", "which", "whose", "whom", "why", "what", "where", "when", "how", "who", "this", "that", "these", "those", "here", "there", "which", "whose", "whom"]));
                let textArea = this.textAreaList[0];
                let textAreaPos = textArea.getBoundingClientRect()
                console.log(textAreaPos, "text area posotion ")
                let div3 = document.createElement("div");
                div3.setAttribute("id", "textarea");

                div3.style = ` top: ${textAreaPos.top}px; left: ${textAreaPos.left}px; width: ${textAreaPos.width}px; height: ${textAreaPos.height}px;box-sizing: content-box;  position: relative; pointer-events: none; overflow: hidden; border: 0px; border-radius: 0px; padding: 0px; margin: 0px;`;
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
const message = {
    type: "TextArea",
    data: textAreaDetector,
};
console.log(logger);

//---------------------------------------------//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
// misspelled word highlighter class
class HighlighterManager {
    #misspelledWordList = new Set();
    #textAreaList = [];
    element = element;
    element2 = element2;
    shadowRoot = shadowRoot;
    element3;
    element4;


    //===========================================================================================================================================================================================================
    //  getTextNodeMetrics(element, words_need) {
    //     const words = element.innerText.split(/(\s+)/);
    //     const metrics = []; // Initialize as an array
    //     const divRect = element.getBoundingClientRect(); // Get the div's position

    //     words.forEach((word, index) => {
    //       if (words_need.has(word)) {
    //         const range = document.createRange();
    //         range.setStart(element.firstChild, words.slice(0, index).join('').length);
    //         range.setEnd(element.firstChild, words.slice(0, index + 1).join('').length);

    //         const rect = range.getBoundingClientRect();

    //         metrics.push({
    //           word: word,
    //           top: rect.top - divRect.top, // Subtract the div's top
    //           left: rect.left - divRect.left, // Subtract the div's left
    //           width: rect.width,
    //           height: rect.height
    //         });
    //       }
    //     });

    //     return metrics;
    //   }
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
        console.log(text_Area, "the text are inside hight function");
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




            text_Area.value = "አማርኛ አማርኛ ";



            logger.info("creating the divs: for mirrowr : inside highlight function");
            var diq = document.createElement("div");
            diq.style = "position: absolute; opacity: 0; pointer-events: none; z-index: -9999; top: 0px; left: 0px; "
            document.body.appendChild(diq);
            logger.info("start of change function: inside highlight function");
            //===========================================================================================================================================================================================================


            function change() {
                text_AreaPos = text_Area.getBoundingClientRect();
                console.log(text_AreaPos, "text area posotion from highlight function")
                highlighterManager.element3.style = `top: ${text_AreaPos.top}px; left: ${text_AreaPos.left}px; width: ${text_AreaPos.width}px; height: ${text_AreaPos.height}px;box-sizing: content-box;  position: relative; pointer-events: none; overflow: hidden; border: 0px; border-radius: 0px; padding: 0px; margin: 0px;`;

                highlighterManager.element4.innerHTML = ""



                console.log(getCaretCoordinates(text_Area, text_Area.selectionStart).div, "the mirro sfvsfdvsfdv r")
                let mirror = getCaretCoordinates(text_Area, text_Area.selectionStart).div
                console.log(mirror, "the mirror")
                if (diq.textContent !== mirror.textContent) {
                    diq.textContent = mirror.textContent;
                }


                for (let property of mirror.style) {
                    diq.style[property] = mirror.style[property];
                }

                console.log(diq, "the diq")
                const vals = highlighterManager.getTextNodeMetrics(diq, misspelled_words)
                console.log(vals, "vals")
                for (const wors of vals) {
                    console.log(wors)
                    highlighterManager.create_misspelled_divs(wors)
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

    create_misspelled_divs(name) {
        logger.info(
            "creating the divs for misspelled to be highlighted: inside create_misspelled_divs function"
        );
        // name is each word in the text area that are misspelled with their position
        let misspelled_word = document.createElement("div");
        misspelled_word.id = `artai_misspelled_word${name.ID}`; // need to have additonal id for each word
        misspelled_word.style = `top: ${name.top}px; left: ${name.left}px; width: ${name.width}px; height: ${name.height}px; border-bottom: 2px solid red; position: absolute; `;
        // if the misspelled word div with id of misspelled_word already there dont' add
        if (
            shadowRoot.querySelector(`#artai_misspelled_word${name.ID}`) === null
        ) {
            highlighterManager.element4.appendChild(misspelled_word);
        }

        let element5 = shadowRoot.querySelector(
            `#artai_misspelled_word${name.ID}`
        );
        console.log(element5, "element5");
        let misspelled_word_inner = document.createElement("div");
        misspelled_word_inner.id = `artai_misspelled_word_inner${name.ID}`; // need to have additonal id for each word
        //add class attribute to the div
        misspelled_word_inner.classList.add("highlight_red");
        element5.appendChild(misspelled_word_inner);

        let element6 = shadowRoot.querySelector(
            `artai_misspelled_word_inner${name.ID}`
        ); //need to have additonal id for each word
        //add event listener to the for mouse hover

        misspelled_word_inner.addEventListener("mouseover", function () {
            misspelled_word_inner.style = "background-color:yellow";
        });
    }
    //===========================================================================================================================================================================================================
    //======//===========================================================================================================================================================================================================
    getTextNodeMetrics(element, words_need) {
        console.log("posiitio checking started")
        const words = element.innerText.split(/(\s+)/);
        console.log(words, " inside position the list text inside text area")
        const metrics = []; // Initialize as an array
        const divRect = element.getBoundingClientRect(); // Get the div's position
        console.log(divRect, "the text are posiiton inside positio function")
        let id = 0;
        words.forEach((word, index) => {
            if (words_need.has(word)) {
                const range = document.createRange();
                range.setStart(element.firstChild, words.slice(0, index).join('').length);
                range.setEnd(element.firstChild, words.slice(0, index + 1).join('').length)

                const rect = range.getBoundingClientRect();
                console.log(rect, "the rect of each   word")

                metrics.push({
                    ID: id,
                    word: word,
                    top: rect.top - divRect.top, // Subtract the div's top
                    left: rect.left - divRect.left, // Subtract the div's left
                    width: rect.width,
                    height: rect.height
                });

            }
            id += 1
        });

        return metrics;
    }
    ////===========================================================================================================================================================================================================

    removehighlight(word) {
        // delete the wordlist from the set
        this.#misspelledWordList.delete(word);
        this.highlight();
    }
    subscribeEvent(channel) {
        EventDispatcherObj.subscribe(channel, this);
    }
    handleEvent(event) {
        logger.info(`highlighter manager is handling the event ${event.type} `);
        console.log(event, "event from highlighter manager");
        switch (event.type) {
            case "MisspelledWord":
                logger.info("Misspelled word is received from the server");
                this.#textAreaList = event.DOM;
                this.#misspelledWordList = event.data;
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
chrome.runtime.onMessage.addEventListener(function (request, sender, sendResponse) {

    if(request.type === "correctedText"){
        // send to the user interface manager
        // TODO: send the recieved data to the correct place
    }
})