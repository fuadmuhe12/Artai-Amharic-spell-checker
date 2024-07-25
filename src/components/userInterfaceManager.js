/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-private-class-members */

import logger from "../utils/logger";
import EventDispatcherObj from "./eventDispatcher";
import { dataSentOnce } from "./communicationManager";
"use strict";
// Class for text area detector in web page

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
        //console.log("userinterafce manager , handle event started");
        //{ "DOM": this.textAreaList, "GeezScript": null }
        //{ type:"textArea", DOM: this.textAreaList, GeezScript: null }
        //console.log("event is started");
        switch (event.type) {
            case "textArea":
                //console.log("text area event is started");
                { logger.info("text area is detected and spellcheck is activated");
                this.#textAreaList = event.DOM;
                const textArea1 = this.#textAreaList[0];
                // initialize the spellcheck status
                this.#spellcheckStatus = true;
                // inject an image icon into the parent of text area
                const parent = textArea1.parentElement;


                break; }
            case "GeezScript":
                { logger.info(`UIM recieded GeezScript , ready to send the text to the server for scanning : UMI line 262`);
                // I want the data  to be sent only if  the sentdata is false

                //console.log("sending the geez @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",this.#textAreaList[0].value) 

                // if GeezScript is detected, activate the spellcheck to send the text to the server
                this.#GeezScript = event.DOM;
                this.#GeezScript = true;


                let textToBeSent = this.#textAreaList[0].value; // for scanning

                this.sendToCommunicationManager(textToBeSent);
                // send the text to the server for scanning
                dataSentOnce = true;

                break; }
        }
    }
    sendToCommunicationManager(text) {
        let message = {
            type: "textforScanning",
            data: text,
        };


        logger.info("sending text to communication manager found in background script to scan the text:  UIM/ sendToCommunicationManager function line 288");
        // eslint-disable-next-line no-undef
        chrome.runtime.sendMessage(message, function (response) {
            logger.info(
                `reponse from background script from recieving text for analysis : ${response.result} , : UIM/ sendToCommunicationManager function line 291`
            );
        });
        // eslint-disable-next-line no-undef
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
        //console.log(result, "result from UIM class line: 308")
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
export default userInterfaceManager;