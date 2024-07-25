import { EventDispatcherObj } from "./eventDispatcher.js";
import { logger } from "./logger.js";

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
                {
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
}

const geezScriptDetector = new GeezScriptDetector();
geezScriptDetector.subscribeEvent("TextArea");

export default  geezScriptDetector 