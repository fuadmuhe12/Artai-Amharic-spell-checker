/* eslint-disable no-undef */
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

export default listChannels;
export { channel_1_TextArea, channel_2_Geez, channel_3_Misspelled, channel_4_Suggestion, channel_5_Interact };