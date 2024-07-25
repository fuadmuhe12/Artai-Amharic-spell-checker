/* eslint-disable no-unused-private-class-members */
import { logger } from "../utils/logger.js";
import { highlighterManager } from "./highlightManager.js";
import { shadowRoot } from "./shadowRoot.js";
import { EventDispatcherObj } from "./eventDispatcher.js";
class SuggestionsManager {
    #suggestionList = [];


    showSuggestions() {
        logger.info("suggesion manager is activated: now inside showSuggestions function");
   

    }
    displaySuggesion(num) {
        let diq_div = document.getElementById("diq");
        const all_text = diq_div.innerText.split(/(\s+)/);
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
                //console.log(suggestionsManager.#suggestionList, "before removing suggestion ################### inside suggestion manger")
                //suggestionsManager.#suggestionList.splice(index,1)

                highlighterManager.removehighlight(word, place, index)
                //console.log(suggestionsManager.#suggestionList, "index from suggestion#################################3   inside suggestion manager- ")

                //console.log(suggestionsManager.#suggestionList, "suggestionsManager.#suggestionList after removing the word")
            }
            else if (event.target.id === "addToDic") {

                let wordToAdd = all_text[Number(event.target.dataset.wordplace)];
                let added_word = shadowRoot.querySelector(`[data-miss-word-place="${event.target.dataset.wordplace}"]`)

                //console.log(added_word, "word to add to dic")
                added_word.remove()
                logger.info(`the word ${wordToAdd} is added to the dictionary`)
                let messageToAddToDic = {
                    type: "addToDic",
                    data: wordToAdd
                }
                // eslint-disable-next-line no-undef
                chrome.runtime.sendMessage(messageToAddToDic, function (response) {
                    logger.info(`response from the backgound script for reciving add to dictionary: ${response.result}`);
                })
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

export default suggestionsManager;
