(function () {
    const log = require('loglevel');
    const fs = require('fs');
    const path = require('path');

    const autoComplete = require('./lib/pixabay-autoComplete/auto-complete.min.js');

    class SearchBox extends HTMLElement {

        createdCallback() {

            let searchBox = this;

            this.loadFile('search-box.html')
                    .then(template => {
                        this.innerHTML = template;
                        this.input = this.querySelector('input');
                        this.form = this.querySelector('form');

                        var my_autoComplete = new autoComplete({
                            selector: this.input,
                            source: (term, suggest) => searchBox.dispatchEvent(
                                    new CustomEvent('complete', {detail: {term: term, suggest: suggest}})),
                            renderItem: function (item, search) {
                                log.debug(`item: ${item}, search: ${search}`);
                                search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                                var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
                                return '<div class="autocomplete-suggestion" data-val="' + item + '">' +
                                        item.replace(re, "<b>$1</b>") + '</div>';
                            }
                        });

                        this.form.addEventListener('submit', event => {
                            this.dispatchEvent(new CustomEvent('search', {detail: {term: this.input.value}}));
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

