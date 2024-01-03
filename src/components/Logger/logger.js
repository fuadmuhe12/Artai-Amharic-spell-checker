
// logger class


// Enum for log levels
const LogLevel = {
    Info: 1,
    Warn: 2,
    Error: 3,
    // Add more levels as needed
};

class Logger {
    constructor(options = {}) {
        this.level = options.level || LogLevel.Info;
        this.destination = options.destination || 'console';
    }

    log(message, level = LogLevel.Info) {
        if (level >= this.level) {
            const formattedMessage = this.formatMessage(message, level);
            this.output(formattedMessage);
        }
    }

    output(message) {
        switch (this.destination) {
            case 'console':
                console.log(message);
                break;
            case 'file':
                // Implement file output asynchronously with error handling
                // Example: await fs.promises.writeFile('log.txt', message);
                break;
            default:
                console.warn(`Unknown logging destination: ${this.destination}`);
        }
    }

    info(message) {
        this.log(message, LogLevel.Info);
    }

    warn(message) {
        this.log(message, LogLevel.Warn);
    }

    error(message) {
        this.log(message, LogLevel.Error);
    }

    formatMessage(message, level) {
        // Include contextual information in the log message
        const timestamp = new Date().toISOString();
        return `[${timestamp}] (${level}): ${message}`;
    }
}
const logger  =  new Logger();
export default logger
