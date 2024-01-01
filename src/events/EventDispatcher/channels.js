/* channel is the like event with name
 of the subscribers and refrence to 
 their objects
 */
import  {Event_1_TextArea, Event_2_Geez, Event_3_Misspelled, Event_4_Suggestion, Event_5_Interact} from '../event/event.js';
class channel{
    constructor(channelName, eventName){
        this.channelName = channelName;
        this.eventName = eventName;
        this.subscribers = [];
    }
}


listChannels = new Set();

let channel_1_TextArea = new channel("TextArea", Event_1_TextArea);
let channel_2_Geez  = new channel("GeezScript", Event_2_Geez);
let channel_3_Misspelled = new channel("MisspelledWord", Event_3_Misspelled);
let channel_4_Suggestion = new channel("Suggestion", Event_4_Suggestion);
let channel_5_Interact = new channel("Interact", Event_5_Interact);
// to the list of channels
listChannels.add(channel_1_TextArea);
listChannels.add(channel_2_Geez);
listChannels.add(channel_3_Misspelled);
listChannels.add(channel_4_Suggestion);
listChannels.add(channel_5_Interact);
// export {listChannels, channel_1_TextArea, channel_2_Geez, channel_3_Misspelled, channel_4_Suggestion, channel_5_Interact};
export {listChannels};
export default channel;