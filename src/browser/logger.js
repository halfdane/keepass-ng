(function (console) {
    var __no_op = x => x;
    const log = {
        debug: __no_op,
        error: __no_op,
        warn: __no_op,
        info: __no_op,
        setDebug: isDebug => {
            if (!!isDebug) {
                log.debug = console.log.bind(console, 'debug: %s');
                log.error = console.error.bind(console, 'error: %s');
                log.info = console.info.bind(console, 'info: %s');
                log.warn = console.warn.bind(console, 'warn: %s');
            } else {
                log.debug = __no_op;
                log.error = __no_op;
                log.info = __no_op;
                log.warn = __no_op;
            }
        }
    };
    module.exports = log;
    return log;
})(console);