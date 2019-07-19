const logger = (log) => {
    if (log.isError) {
        console.error(">>>> " + new Date().toUTCString() + " >>>> method: " + log.method + ", message: " + log.message + "\n");
    } else {
        console.log(">>>> " + new Date().toUTCString() + " >>>> method: " + log.method + ", message: " + log.message + "\n");
    }
};
module.exports = logger;