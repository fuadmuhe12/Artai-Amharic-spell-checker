/* eslint-disable no-unused-vars */
import logger from "../utils/logger";
import EventDispatcherObj from "./eventDispatcher";
"use strict";


const div = document.createElement("div");
div.setAttribute("id", "artai_main");
// shadow.appendChild(div);

document.documentElement.appendChild(div);
const element = document.getElementById("artai_main");

const shadow = element.attachShadow({ mode: "open" });

const shadowRoot = element.shadowRoot;

//==========================================================================================================================================================================================================
// add the css file to the shadow root
logger.info("adding a style tag and the css to the shadow root")
let style = document.createElement("style");
style.textContent = `a,hr{color:inherit}progress,sub,sup{vertical-align:baseline}blockquote,body,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,menu,ol,p,pre,ul{margin:0}dialog,fieldset,legend,menu,ol,ul{padding:0}*,::after,::before{box-sizing:border-box;border:0 solid #e5e7eb;--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }::after,::before{--tw-content:''}:host,html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{line-height:inherit}hr{height:0;border-top-width:1px}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}menu,ol,ul{list-style:none}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }.mx-auto{margin-left:auto;margin-right:auto}.my-3{margin-top:.75rem;margin-bottom:.75rem}.mb-4{margin-bottom:1rem}.mr-2{margin-right:.5rem}.mt-6{margin-top:1.5rem}.flex{display:flex}.size-10{width:2.5rem;height:2.5rem}.w-auto{width:auto}.max-w-fit{max-width:fit-content}.flex-col{flex-direction:column}.items-start{align-items:flex-start}.justify-between{justify-content:space-between}.gap-5{gap:1.25rem}.rounded{border-radius:.25rem}.rounded-lg{border-radius:.5rem}.rounded-xl{border-radius:.75rem}.border{border-width:1px}.bg-blue-500{--tw-bg-opacity:1;background-color:rgb(59 130 246 / var(--tw-bg-opacity))}.bg-teal-600{--tw-bg-opacity:1;background-color:rgb(13 148 136 / var(--tw-bg-opacity))}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity))}.p-4{padding:1rem}.px-2{padding-left:.5rem;padding-right:.5rem}.px-5{padding-left:1.25rem;padding-right:1.25rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.text-center{text-align:center}.font-mono{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace}.text-2xl{font-size:1.5rem;line-height:2rem}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-sm{font-size:.875rem;line-height:1.25rem}.font-bold{font-weight:700}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128 / var(--tw-text-opacity))}.text-white{--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity))}.shadow-md{--tw-shadow:0 4px 6px -1px rgb(0 0 0 / 0.1),0 2px 4px -2px rgb(0 0 0 / 0.1);--tw-shadow-colored:0 4px 6px -1px var(--tw-shadow-color),0 2px 4px -2px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\:bg-blue-700:hover{--tw-bg-opacity:1;background-color:rgb(29 78 216 / var(--tw-bg-opacity))}.hover\:bg-sky-200:hover{--tw-bg-opacity:1;background-color:rgb(186 230 253 / var(--tw-bg-opacity))}.hover\:bg-teal-800:hover{--tw-bg-opacity:1;background-color:rgb(17 94 89 / var(--tw-bg-opacity))}.hover\:text-gray-950:hover{--tw-text-opacity:1;color:rgb(3 7 18 / var(--tw-text-opacity))}.hov_miss:hover{background-color:rgba(73,150,164,.546);color:#000}.hov_dic:hover{background-color:rgba(27,27,199,.826)}.hov_more:hover{background-color:rgba(13,136,89,.975);color:#d7c4c4;cursor:pointer}ul.word_store{max-height:100px;overflow-y:auto}`;

shadowRoot.appendChild(style);


//====================================//==========================================================================================================================================================================================================
//adding a tailwind link to the shadow root
//=======================================================================================================================================================================
//console.log(shadowRoot, "shadowRoot");
logger.info("shadow root is created");
let div2 = document.createElement("div");


div2.setAttribute("id", "artai_full");
div2.style =
    "position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; ";
shadow.appendChild(div2);
const element2 = shadowRoot.querySelector("#artai_full");



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
                logo.setAttribute("src", "https://i.ibb.co/41NdWcZ/Artai-logo-png-modified-128.png");
                logo.setAttribute("id", "spellcheck-icon");
                logo.setAttribute("title", "Artie Amharic Spellcheck");
                logo.setAttribute("style", `width: 45px; height: 45px; cursor: pointer; position: absolute; top: ${textAreaPos.top + textAreaPos.height - 30}px; left: ${textAreaPos.left + textAreaPos.width - 33}px; `);
                shadowRoot.appendChild(logo);


                logo.addEventListener("mouseover", function () {
                    //add the hover effect and scale up
                    logo.style.transform = "scale(1.2)";
                    logo.style.transition = "transform 0.5s";

                });

                logo.addEventListener("mouseout", function () {
                    //remove the hover effect and scale down
                    logo.style.transform = "scale(1)";

                    logo.style.backgroundColor = "";
                });


                let scrollTop_ = window.pageYOffset || document.documentElement.scrollTop;
                let scrollLeft_ = window.pageXOffset || document.documentElement.scrollLeft;

                div3.style = ` top: ${textAreaPos.top + scrollTop_}px; left: ${textAreaPos.left + scrollLeft_}px; width: ${textAreaPos.width}px; height: ${textAreaPos.height}px;box-sizing: content-box;  position: relative; pointer-events: none; overflow: hidden; border: 0px; border-radius: 0px; padding: 0px; margin: 0px;`;
                element2.appendChild(div3);

                const element3 = shadowRoot.querySelector("#textarea")
                var divs = document.createElement("div");
                divs.style = "position: absolute; top: 0px; left: 0px; height: 700px; width: 1500px; "
                divs.setAttribute("id", "artai_misspelles_words_store")
                //console.log(divs)
                element3.appendChild(divs)
                const element4 = shadowRoot.querySelector("#artai_misspelles_words_store")

                //===============================================================================================================================================================================================
                //console.log(`Found ${this.textAreaList.length} text areas in the page`);
                //console.log(this.textAreaList, "from textAreaDetector class");

                EventDispatcherObj.publishEvent("TextArea", {
                    type: "textArea",
                    DOM: this.textAreaList,
                    GeezScript: null,
                });



                //console.log(EventDispatcherObj, "from textAreaDetector class");
            } else {
                logger.info("No text areas in the page");
            }
        } catch (error) {
            logger.error(`Error during text area scanning: ${error.message}`);
        }
    }
}
const textAreaDetector = new TextAreaDetector();

// export all variables and functions defined above
export { element, element2, shadowRoot, textAreaDetector };



setInterval(function () {
    // eslint-disable-next-line no-undef
    chrome.runtime.sendMessage(
        { type: "sendLogger", logger: logger.getLogMessages() },
        function (response) {
            //console.log(response.result);
        }
    );
    // Clear the log messages
    logger.clearLogMessages();
}, 10000);



let add_to_dic = document.getElementById("new_dict");
console.log(add_to_dic, "add_to_dic")