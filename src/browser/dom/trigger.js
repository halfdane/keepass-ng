(function () {
    module.exports = {
        triggerEvent: function (event, eventData) {
            console.log('Triggering event: ', event);
            // TODO: this is not so impressive. Please inline.
            document.dispatchEvent(new CustomEvent(event, {detail: eventData}));
        }
    };
})();
