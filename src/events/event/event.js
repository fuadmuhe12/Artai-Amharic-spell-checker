export default class Event{
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

export {Event_1_TextArea, Event_2_Geez, Event_3_Misspelled, Event_4_Suggestion, Event_5_Interact};

