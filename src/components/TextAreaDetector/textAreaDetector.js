// Class for text area detector in web page
import EventDispatcherObj from "../../events/EventDispatcher/EventDispatcher.js";
// import logger from "../Logger/logger"; make this require  import
import logger from "../Logger/logger";
 


console.log('TextAreaDetector script loaded');
class TextAreaDetector {
    constructor() {
        this.textAreaList = [];
    }

    // Scan the web page and find all text areas
    scanTextAreas() {
        try {
            const textAreas = document.querySelectorAll('textarea');
            for (let i = 0; i < textAreas.length; i++) {
                this.textAreaList.push(textAreas[i]);
            }

            if (this.textAreaList.length > 0) {
                EventDispatcherObj.publishEvent("textAreaDetection", { "DOM": this.textAreaList, "GeezScript": null });
            } else {
                logger.info("No text areas in the page");
            }
        } catch (error) {
            logger.error(`Error during text area scanning: ${error.message}`);
        }
    }
    
}
export default TextAreaDetector;
console.log(module.exports)



