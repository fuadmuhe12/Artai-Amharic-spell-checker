import TextAreaDetector from "../components/TextAreaDetector/textAreaDetector";
import EventDispatcher from "../events/EventDispatcher/EventDispatcher";
import Logger from "../components/Logger/logger";

const logger = Logger;
const eventDispatcher = EventDispatcher;
const textAreaDetector = new TextAreaDetector();

console.log('Background script loaded');
// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        logger.info(`Tab updated: ${tabId}`);
        // Perform text area scanning when a tab is updated
        scanTextAreasInTab(tab);
    }
});

// Function to scan text areas in a tab
function scanTextAreasInTab(tab) {
    try {
        logger.info(`Scanning text areas in tab: ${tab.id}`);
        textAreaDetector.scanTextAreas();
    } catch (error) {
        logger.error(`Error during text area scanning: ${error.message}`);
    }
}


// ...

