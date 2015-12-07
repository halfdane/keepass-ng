import log from 'loglevel';

import fs from 'fs';
import path from 'path';

import Mark from 'markup-js';

function remember() {
    return window.global.remember;
}
export default class AccessDatabase {
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
                document.getElementById('access_database-okay')
                        .addEventListener('click', () => {
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