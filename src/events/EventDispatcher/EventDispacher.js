import  {listChannels} from "./channels.js"
class eventDispatcher{
    constructor(){
        this.channels = listChannels;
    }
    subscribe(channelName, subscriber){
        if (this.channels[channelName]){
            this.channels[channelName].subscribers.push(subscriber);
        }
        else{
            console.log(`No channel with name ${channelName} ` );
        }
       }
    publishEvent(channelName, Event){
        if (this.channels[channelName]){
            this.channels[channelName].subscribers.foreach(function(subscriber){
                subscriber.handleEvent(Event);
                // the handleEvent function should be implemented in the subscriber class
            })
        }
        else{
            console.log(`No channel with name ${channelName} `);
        }
    }
    getChannelSubscribers(channelName){
        return this.channels[channelName].subscribers;
    }   
}
export default new eventDispatcher();

