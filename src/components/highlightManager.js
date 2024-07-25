/* eslint-disable no-unused-vars */
import { element2, element, shadowRoot } from "./textAreaDetector";
import { EventDispatcherObj } from "./eventDispatcher";
import { logger } from "./logger";
import { suggestionsManager } from "./suggestionManager";
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
    highlight() {
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
                // eslint-disable-next-line no-undef
                typeof module.exports != "undefined"
            ) {
                // eslint-disable-next-line no-undef
                module.exports = getCaretCoordinates;
            } else if (isBrowser) {
                window.getCaretCoordinates = getCaretCoordinates;
            }
        })();



        //===============================================================================================================================================================================================
        // log evry momoment for debuuig
        logger.info("highlighter is activated: now inside highlight function");
        let text_Area = this.#textAreaList[0];
        // if the text Area is defined
        if (text_Area !== undefined) {
            let misspelled_words = this.#misspelledWordList;
            if (misspelled_words.size === 0) {
                logger.info("No misspelled words to highlight");
                // eslint-disable-next-line no-undef
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
                // eslint-disable-next-line no-undef
                element3.appendChild(divs);
            }

            // place where the div of misspelled words will be stored
            // //console.log('This is fine')
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
                //console.log(text_AreaPos, "text area posotion from highlight function")
                highlighterManager.element3.style = `top: ${text_AreaPos.top + scrollTop__}px; left: ${text_AreaPos.left + scrollLeft__}px; width: ${text_AreaPos.width}px; height: ${text_AreaPos.height}px;box-sizing: content-box;  position: relative; pointer-events: none; overflow: hidden; border: 0px; border-radius: 0px; padding: 0px; margin: 0px;`;

                highlighterManager.element4.innerHTML = ""
                //up date the  posision of  logo icon
                let logo = shadowRoot.querySelector("#spellcheck-icon");
                logo.style = `width: 35px; height: 35px;  cursor: pointer; position: absolute; top: ${text_AreaPos.top + scrollTop__ + text_AreaPos.height - 40}px; left: ${text_AreaPos.left + scrollLeft__ + text_AreaPos.width - 43}px; `;



                //console.log(getCaretCoordinates(text_Area, text_Area.selectionStart).div, "the mirro sfvsfdvsfdv r")
                text_Area = highlighterManager.#textAreaList[0];
                // eslint-disable-next-line no-undef
                let mirror = getCaretCoordinates(text_Area, text_Area.selectionStart).div
                //console.log(mirror, "the mirror")
                if (diq.textContent !== mirror.textContent) {
                    diq.textContent = mirror.textContent;
                }


                for (let property of mirror.style) {
                    diq.style[property] = mirror.style[property];
                }

                //console.log(diq, "the diq")
                const vals = highlighterManager.getTextNodeMetrics(diq, misspelled_words)// get the position of each word in the text area
                //console.log(vals, "vals")
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
            window.addEventListener('scroll', function () {
                if (window.scrollY > 25 || window.scrollX > 25) {
                    change()
                }
            });

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

    // eslint-disable-next-line no-unused-vars
    create_misspelled_divs(name, suggestionList) {
        //location of the text area from the current window
        let textAreaPos_ = this.#textAreaList[0].getBoundingClientRect();


        logger.info(
            "creating the divs for misspelled to be highlighted and also their sugggestion: inside create_misspelled_divs function"
        );
        // name is each word in the text area that are misspelled with their position
        let misspelled_hub = document.createElement("div")
        misspelled_hub.style.pointerEvents = "auto";
        misspelled_hub.style.zIndex = "1000";
        misspelled_hub.style = "width:100%; height:100%;"
        misspelled_hub.dataset.missWordPlace = name.word_ID
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
        suggestion_div.style = `position:fixed; top: ${name.top + name.height + 3 + textAreaPos_.top}px; left: ${name.left - 10 + textAreaPos_.left}px; `
        suggestion_div.style.display = "none";
        suggestion_div.style.zIndex = "99999";
        suggestion_div.dataset.suggestion = 'suggestion'
        suggestion_div.dataset.suggestionPlace = `${name.ID}`;
        suggestion_div.id = `artai_suggestion${name.ID}`;
        suggestion_div.classList.add("suggestion_div");
        suggestion_div.innerHTML = '<div class="text p-4 bg-white border  text-gray-500 shadow-md max-w-fit flex flex-col rounded-xl"  >' +
            '<div class="title text-lg font-bold px-5 mb-4">Correct your spelling</div>' +
            '<ul class="text-center flex flex-col word_store">' +
            '</ul>' +
            '<div class="flex flex-col gap-5 justify-between items-start mt-6">' +
            '<div class="flex ">' +
            '<span class="flex" id="add_to_dic">' +
            '<img src="https://i.ibb.co/Dkrtj44/add-to-dic.png" alt="add_to_dic" class="mr-2 size-10">' +
            `<button class="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold px-2 px- rounded hov_dic" data-wordplace = ${name.word_ID} id = "addToDic">Add to Dictionary</button>` +
            '</span>' +
            '</div>' +
            '<div class="mx-auto my-3 ">' +
            '<a class="btn btn-primary bg-teal-600 hover:bg-teal-800 text-white font-bold py-2 px-2 rounded hov_more" id="ignore">See more about Artai</a>' +
            '</div>' +
            '</div>' +
            '</div>';
        suggestion_div.style.pointerEvents = "auto";
        let ul = suggestion_div.querySelector('.text-center');
        if (highlighterManager.#suggestedList.length > 0) {
            let num = 0;
            //console.log(highlighterManager.#suggestedList, "highlighterManager.#suggestedList")

            if (highlighterManager.#suggestedList[name.ID].length > 0) {
                highlighterManager.#suggestedList[name.ID].forEach((suggestion) => {
                    let li = document.createElement('button');
                    li.className = 'text-2xl hover:bg-sky-200 hover:text-black-950 hov_miss  rounded-lg font-mono ';
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
        //console.log(words, " inside position the list text inside text area")
        const metrics = []; // Initialize as an array
        let divRect = element.getBoundingClientRect(); // Get the div's position
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;


        // divRect.top += scrollTop; // Add the scroll top
        // divRect.left += scrollLeft; // Add the scroll left

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
                    top: rect.top - (divRect.top), // Subtract the div's top
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
        //console.log(this.#suggestedList, `suggestion before removing --------------------------- inside hightligt`)
        this.#suggestedList.splice(index, 1) // remove the suggestion from the list
        //console.log(this.#suggestedList, "after removing the suggestion-------------------------------- inside highlight")
        logger.info(`suggestedList after removing ${this.#suggestedList} : inside removehighlight function line:1006`)

        this.#misspelledWordList.delete(word);
        const words = this.#textAreaList[0].value.split(/(\s+)/);
        words[place] = word;
        this.#textAreaList[0].value = words.join('');
        // remove the divs from the shadow root
        //console.log(index, "index from suggestion---------------------------------- ")

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
        //console.log(event, "event from highlighter manager");
        switch (event.type) {
            case "MisspelledWord and suggestion":
                logger.info("Misspelled word is received from the server and highlight is activated: from highlighterManager event handler");
                this.#textAreaList = event.DOM;
                this.#misspelledWordList = event.misspelledData;
                this.#suggestedList = event.suggestionData;
                //console.log(this.#misspelledWordList, "this.#misspelledWordList from highlighter manager")
                //console.log(this.#suggestedList, "this.#suggestedList from highlighter manager")
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

export default highlighterManager;