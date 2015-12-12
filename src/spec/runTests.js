const ipc = require('electron').ipcRenderer;

(function () {
    global.browserconsole = console;
    console = require('remote').require('console');
    window.onerror = function (message, filename, line, col, error) {
        ipc.send('mocha-error', {
            message: message,
            filename: filename,
            err: error,
            stack: error.stack
        });
        console.error(error.stack);
    };

    global.log = require('../browser/logger');

})();

(function () {
    function createMouseEvent(eventName) {
        if (!window.HTMLElement.prototype[eventName]) {
            window.HTMLElement.prototype[eventName] = function () {
                var ev = document.createEvent('MouseEvent');
                ev.initMouseEvent(
                        eventName,
                        /*bubble*/true, /*cancelable*/true,
                        window, null,
                        0, 0, 0, 0, /*coordinates*/
                        false, false, false, false, /*modifier keys*/
                        0/*button=left*/, null
                );
                this.dispatchEvent(ev);
            };
        }
    }

    createMouseEvent('dblclick');
})();

const Mocha = require('mocha');
const chai = require('chai')
        .use(require('chai-as-promised'))
        .use(require('sinon-chai'))
        .use(require('chai-dom'));
chai.config.includeStack = true;
global.expect = chai.expect;
global.sinon = require('sinon');

window.onload = function () {
    ipc.on('mocha-run', function (event, files) {
        var mocha = new Mocha({
            ui: 'bdd',
            reporter: 'mocha-better-spec-reporter'
        });

        mocha.checkLeaks();
        for (let file of files) {
            mocha.addFile(file);
        }
        mocha.run((failureCount) => {
            ipc.send('mocha-done', failureCount);
        });

    });
};

