(function () {
    const fs = require('fs');
    const path = require('path');

    const log = require('loglevel');
    const Mark = require('markup-js');

    function remember() {
        return window.global.remember;
    }

    module.exports = class AccessDatabase {
        constructor(errors = {}) {
            log.debug('retrieving database access information from user');
            const model = {
                errors: errors,
                lastAccessedFile: remember().lastAccessedFile()
            };

            log.debug('model is prepared', model);
            return this.loadFile('access_database.html')
                    .then(this.renderTemplate(model))
                    .then(this.putInDom())
                    .then(this.wait())
                    .then(this.done())
                    .then(info => info)
        }

        loadFile(filename) {
            return new Promise((resolve, reject) => {
                        log.debug('Opening template');
                        fs.readFile(path.resolve(__dirname, filename), 'UTF-8', (err, data) => {
                            if (!!err) {
                                reject(err);
                            } else {
                                resolve(data);
                            }
                        });
                    }
            );
        }

        renderTemplate(model) {
            return templateString => {
                return new Promise((resolve) => {
                    log.debug('rendering template ', model);
                    resolve(Mark.up(templateString, model));
                });
            };
        }

        putInDom() {
            return htmlString => {
                return new Promise((resolve) => {
                    log.debug('opening dialog');
                    document.body
                            .insertAdjacentHTML('beforeend', htmlString);

                    const showHideHint = document.getElementById('access_database-show-password');
                    showHideHint.innerText = 'Show';
                    showHideHint.classList.add('js_show');

                    showHideHint.addEventListener('click', () => {
                        const password = document.getElementById('access_database-password');
                        if (showHideHint.classList.contains('js_show')) {
                            password.type = 'text';
                            showHideHint.innerText = 'Hide';
                        } else {
                            password.type = 'password';
                            showHideHint.innerText = 'Show';
                        }
                        showHideHint.classList.toggle('js_show');
                    });
                    let element = document.getElementById('access_database');

                    this.modal = new Modal(element);
                    this.modal.open();
                    resolve();
                });
            };
        }

        wait() {
            return () => {
                return new Promise((resolve) => {
                    log.debug('adding event listeners');
                    document.getElementById('access_database-form')
                            .addEventListener('submit', event => {
                                event.preventDefault();
                                resolve('okay');
                            });
                    document.getElementById('access_database-okay')
                            .addEventListener('click', event => {
                                event.preventDefault();
                                resolve('okay');
                            });
                    document.getElementById('access_database-cancel')
                            .addEventListener('click', () => {
                                resolve('cancel');
                            });
                });
            };
        }

        done() {
            return selection => {
                return new Promise((resolve) => {
                    log.debug('handling user action ', selection);
                    if (selection === 'okay') {
                        resolve({
                            dbfile: document.getElementById('access_database-dbfile').value,
                            password: document.getElementById('access_database-password').value,
                            keyfile: document.getElementById('access_database-keyfile').value
                        });
                    } else if (selection === 'cancel') {
                        resolve();
                    }

                    if (!!this.modal) {
                        this.modal.close();
                        setTimeout(x=> {
                            document.body.removeChild(
                                    document.getElementById('access_database'));
                        }, 500);
                    }
                });
            };
        }
    }
})();