(function () {
    const log = require('loglevel');
    const fs = require('fs');
    const path = require('path');

    class SearchBox extends HTMLElement {

        createdCallback() {
            this.loadFile('search-box.html')
                    .then(template => {
                        this.innerHTML = template;
                        this.input = this.querySelector('input');
                        this.form = this.querySelector('form');

                        this.input.addEventListener('input', event => {
                            this.dispatchEvent(new CustomEvent('complete', {detail: {term: this.input.value}}))
                        });

                        this.form.addEventListener('submit', event => {
                            this.dispatchEvent(new CustomEvent('search', {detail: {term: this.input.value}}))
                            event.preventDefault();
                        });
                    })
                    .catch(err => log.error(err));
        }

        found(result = '') {
            log.debug(result);
        }

        loadFile(filename) {
            return new Promise((resolve, reject) => {
                        log.debug('Opening template ');
                        fs.readFile(path.resolve(__dirname, 'dom/components', filename), 'UTF-8', (err, data) => {
                            if (!!err) {
                                reject(err);
                            } else {
                                resolve(data);
                            }
                        });
                    }
            );
        }
    }

    try {
        document.registerElement('halfdane-searchbox', SearchBox);
    } catch (error) {
    }

})();

