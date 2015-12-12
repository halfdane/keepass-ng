(function () {

    const Mark = require('markup-js');
    const events = require('events');

    const log = require('../logger');
    require('./event_delegation.js');

    const template = `
        {{if entries}}
        <table class="table table-striped table-hover">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Username</th>
                    <th>Password</th>
                    <th>URL</th>
                    <th>Notes</th>
                </tr>
            </thead>
            <tbody>
            {{entries}}
                <tr class="entry{{if #|first}} info{{/if}}"
                        data-UUID="{{UUID}}"
                        data-username="{{.|getVal>UserName|blank>}}"
                        data-password="{{.|getPassword|blank>}}">
                    <td>
                        <span class="icon-number-{{IconID}}"></span>
                        <span>{{.|getVal>Title|blank>}}</span>
                    </td>
                    <td>{{.|getVal>UserName|blank>}}</td>
                    <td>****</td>
                    <td>{{.|getVal>URL|blank>}}</td>
                    <td>{{.|getVal>Notes|blank>}}</td>
                </tr>
            {{/entries}}
            </tbody>
        </table>
        {{/if}}
        `;

    module.exports = class EntryList extends events.EventEmitter {
        constructor(domElement = document.getElementById('entries')) {
            super();
            this.element = domElement;
            this.setupEvents();
        }

        setupEvents() {
            this.element.addEventListener('click', e => {
                [].forEach.call(this.element.getElementsByClassName('info'),
                        el => el.classList.remove('info'));

                e.parent('.entry', p => p.classList.add('info'));
                e.stopPropagation();
            });

            this.element.addEventListener('dblclick', event => {
                event.parent('.entry',
                        e => this.emit('navigate', e.getAttribute('data-UUID')));
                event.stopPropagation();
            });
        }

        hide() {
            this.show([]);
        }

        show(entries) {
            this.element.innerHTML = Mark.up(template, {entries: entries},
                    {
                        pipes: {
                            getPassword: function (entry) {
                                return entry.String.get('Password')._;
                            },
                            getVal: function (entry, key) {
                                return entry.String.get(key);
                            }
                        }
                    });
        }

        getIdOfActiveEntry() {
            return new Promise(resolve => {
                resolve(this.element.getElementsByClassName('info').item(0).getAttribute('data-uuid'));
            });
        }

        getPasswordOfActiveEntry() {
            return new Promise(resolve => {
                resolve(this.element.getElementsByClassName('info').item(0).getAttribute('data-password'));
            });
        }

        getUsernameOfActiveEntry() {
            return new Promise(resolve => {
                resolve(this.element.getElementsByClassName('info').item(0).getAttribute('data-username'));
            });
        }
    }

})();

