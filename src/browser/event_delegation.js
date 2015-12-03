(function (document, Event) {

    /* Check various vendor-prefixed versions of Element.matches */
    function matches(selector, currentNode) {
        var vendors = ['webkit', 'ms', 'moz'],
                count = vendors.length, vendor, i;

        for (i = 0; i < count; i++) {
            vendor = vendors[i];
            if ((vendor + 'MatchesSelector') in currentNode) {
                return currentNode[vendor + 'MatchesSelector'](selector);
            }
        }
    }

    /* Traverse DOM from event target up to parent, searching for selector */
    function passedThrough(event, selector, stopAt) {
        var currentNode = event.target;

        while (true) {
            if (matches(selector, currentNode)) {
                return currentNode;
            }
            else if (currentNode !== stopAt && currentNode !== document.body) {
                currentNode = currentNode.parentNode;
            }
            else {
                return false;
            }
        }
    }

    /* Extend the Event prototype to add a parent-searcher */
    Event.prototype.parent = function (toFind, callback) {
        var found = passedThrough(this, toFind, this.currentTarget);

        if (found) {
            callback(found);
        }
        return this;
    };

}(window.document, window.Event || window.Element));