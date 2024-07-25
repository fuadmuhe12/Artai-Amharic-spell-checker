import logger from "../utils/logger";
import listChannels from "./listChannels";

//Evant Dispatcher class
class EventDispatcher {
    channels = listChannels;

    subscribe(channelName, subscriber) {
        logger.info(
            `this.channels: ${channelName} from the EventDispatcher class`
        );
        let channelFound = false;

        for (let element of this.channels) {
            if (element.channelName === channelName) {
                element.subscribers.push(subscriber);
                channelFound = true;
                break;
            }
        }

        if (!channelFound) {
            logger.warn(`No channel with name ${channelName}`);
        }
    }

    publishEvent(channelName, event) {
        let channelFound = false;
        logger.info(`data is being published to channel ${channelName}`);

        for (let element of this.channels) {

            if (element.channelName === channelName) {
                channelFound = true;
                element.subscribers.forEach(function (subscriber) {
                    logger.info(
                        `Event is published to be handled by the channel ${channelName} `
                    );

                    subscriber.handleEvent(event);
                    // the handleEvent function should be implemented in the subscriber class
                });
                if (element.subscribers.length === 0) {
                    logger.warn(`No subscribers for channel ${channelName}`);
                }
                break;
            }
        }

        if (!channelFound) {
            logger.warn(`No channel with name ${channelName}`);
        }
    }

    getChannelSubscribers(channelName) {
        let channelFound = false;
        let subscribers = [];

        for (let element of this.channels) {
            if (element.channelName === channelName) {
                channelFound = true;
                subscribers = element.subscribers;
                break;
            }
        }

        if (!channelFound) {
            logger.warn(`No channel with name ${channelName}`);
        }

        return subscribers;
    }
}

const EventDispatcherObj = new EventDispatcher();

export default EventDispatcherObj;
