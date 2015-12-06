require('chai')
        .use(require('chai-as-promised'))
        .use(require('sinon-chai'));

import 'babel-polyfill';

window.global = window.global || {};
window.global.remember = {
    timeout: () => {
    }
};

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

createMouseEvent('click');
createMouseEvent('dblclick');