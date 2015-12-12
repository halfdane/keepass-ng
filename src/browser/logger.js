(function (console) {
    var __noOp = x => x;
    const log = {
        debug: __noOp,
        error: __noOp,
        warn: __noOp,
        info: __noOp,
        setDebug: isDebug => {
            if (!!isDebug) {
                log.debug = console.log.bind(console, 'debug: %s');
                log.error = console.error.bind(console, 'error: %s');
                log.info = console.info.bind(console, 'info: %s');
                log.warn = console.warn.bind(console, 'warn: %s');
            } else {
                log.debug = __noOp;
                log.error = __noOp;
                log.info = __noOp;
                log.warn = __noOp;
            }
        }
    };
    module.exports = log;
    return log;
})(console);