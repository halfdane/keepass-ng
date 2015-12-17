(function () {
    module.exports = class Dialog {

        constructor(plainOptions) {

            return new Promise(resolve => {
                Ink.requireModules(['Ink.UI.Modal_1'], (Modal) => {
                    new Modal('', Object.assign(
                            {},
                            plainOptions,
                            {
                                onShow: (modal) => {
                                    resolve(modal);
                                    if (!!plainOptions.onShow) {
                                        plainOptions.onShow(e);
                                    }
                                }
                            }));
                });
            });
        }
    }
})();