


if (window._phantom) {
    // Patch since PhantomJS does not implement click() on HTMLElement.

    function enhance(eventName) {
        if (!HTMLElement.prototype[eventName]) {
            HTMLElement.prototype[eventName] = function () {
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
            }
        }
    }

    enhance('click');
    enhance('dblclick');
}




require('./phantomJs-Spec.js');
require('./entry_list-Spec.js');