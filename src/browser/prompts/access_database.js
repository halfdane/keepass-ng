import log from 'loglevel';

import fs from 'fs';
import path from 'path';

import Mark from 'markup-js';

export default class AccessDatabase {
    constructor(errors = {}) {
        return this.loadFile('access_database.html')
                .then(this.renderTemplate({current_dir: __dirname, errors: errors}))
                .then(this.putInDom('access_database'))
                .then(this.waitForClick)
                .then(({dbfile: dbfile, password: password, keyfile: keyfile}) => {
                    return {password: password, dbfile: dbfile, keyfile: keyfile};
                })
                .catch(log.debug);
    }

    loadFile(filename) {
        return new Promise((resolve, reject) => {
                    try {
                        fs.readFile(path.resolve(__dirname, filename), 'UTF-8', (err, data) => {
                            if (!!err) {
                                reject(err);
                            } else {
                                resolve(data);
                            }
                        });
                    } catch (err) {
                        reject(err);
                    }
                }
        );
    }

    renderTemplate(model) {
        return (templateString) => {
            return new Promise((resolve, reject) => {
                try {
                    const rendered = Mark.up(templateString, model);
                    resolve(rendered);
                } catch (err) {
                    reject(err);
                }
            });
        };
    }

    putInDom(elementId) {
        return htmlString => {
            return new Promise((resolve, reject) => {
                try {
                    const element = document.createElement('div');
                    element.id = elementId;
                    element.innerHTML = htmlString;
                    document.body.appendChild(element);
                    document.body.classList.add('modal-open');
                    resolve(element);
                } catch (err) {
                    reject(err);
                }
            });
        };
    }

    waitForClick(element) {
        return new Promise((resolve, reject) => {
            let okay = element.getElementsByClassName('okay')[0];
            okay.addEventListener('click', event => {
                var dbfile = element.getElementsByClassName("dbfile")[0];
                var password = element.getElementsByClassName("password")[0];
                var keyfile = element.getElementsByClassName("keyfile")[0];

                resolve({
                    dbfile: dbfile.value,
                    password: password.value,
                    keyfile: keyfile.value
                });

                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            });

            let cancel = element.getElementsByClassName('cancel')[0];
            cancel.addEventListener('click', event => {
                reject('Abort, abort');
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            });
        });
    }

}