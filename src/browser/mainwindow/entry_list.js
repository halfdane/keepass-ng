import events from 'events';
import './../event/event_delegation.js';

var Mark = require('markup-js');

export default class EntryList extends events.EventEmitter {

    constructor(domElement = document.getElementById('entries')) {
        super();
        this.element = domElement;
        this.setupEvents();

        this.template = `
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
                <tr class="entry" data-UUID="{{UUID}}" data-username="{{String|call>get>UserName|blank>}}">
                    <td>
                        <span class="icon-number-{{IconID}}"></span>
                        <span>{{String|call>get>Title|blank>}}</span>
                    </td>
                    <td>{{String|call>get>UserName|blank>}}</td>
                    <td>****</td>
                    <td>{{String|call>get>URL|blank>}}</td>
                    <td>{{String|call>get>Notes|blank>}}</td>
                </tr>
            {{/entries}}
            </tbody>
        </table>
        `;
    }

    setupEvents() {
        // Click on blank
        this.element.parentNode.addEventListener('click', () => {
            [].forEach.call(this.element.getElementsByClassName('info'),
                    el => el.classList.remove('info'));
        });

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

    show(entries) {
        if (!entries) {
            entries = [];
        }

        this.element.innerHTML = Mark.up(this.template, {entries: entries});
    }

    getIdOfActiveEntry() {
        var self = this;
        return self.element.getElementsByClassName('info').item(0).getAttribute('data-UUID');
    }

    getUsernameOfActiveEntry() {
        var self = this;
        return self.element.getElementsByClassName('info').item(0).getAttribute('data-username');
    }
}

