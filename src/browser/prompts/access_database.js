import log from 'loglevel';

import fs from 'fs';
import path from 'path';

import Mark from 'markup-js';

export default class AccessDatabase {
    constructor() {
        return this.loadFile('access_database.html')
                .then(this.renderTemplate({current_dir: __dirname}))
                .then(this.putInDom('access_database'))
                .then(this.waitForClick)
                .then(() => {
                    return {password: 'password', file: './example.kdbx'};
                })
                .catch(log.debug);
    }

    loadFile(filename) {
        return new Promise((resolve, reject) => {
                    try {
                        log.debug(__dirname);
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
                    resolve(element);
                } catch (err) {
                    reject(err);
                }
            });
        };
    }

    waitForClick(element) {
        return new Promise((resolve, reject) => {
            let button = element.getElementsByClassName('done')[0];
            button.addEventListener('click', event => {
                resolve({element: element, event: event});

                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            });
        });
    }

}