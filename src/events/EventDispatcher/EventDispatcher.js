import { listChannels } from "./channels.js";
console.log('EventDispatcher script loaded');

class EventDispatcher {
    constructor() {
        this.channels = listChannels;
    }

    subscribe(channelName, subscriber) {
        if (this.channels[channelName]) {
            this.channels[channelName].subscribers.push(subscriber);
        } else {
            console.log(`No channel with name ${channelName}`);
        }
    }

    publishEvent(channelName, event) {
        if (this.channels[channelName]) {
            this.channels[channelName].subscribers.forEach(function (subscriber) {
                subscriber.handleEvent(event);
                // the handleEvent function should be implemented in the subscriber class
            });
        } else {
            console.log(`No channel with name ${channelName}`);
        }
    }

    getChannelSubscribers(channelName) {
        return this.channels[channelName].subscribers;
    }
}



export default new EventDispatcher()
