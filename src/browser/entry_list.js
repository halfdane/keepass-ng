import events from 'events';
import './event_delegation.js';

var Mark = require('markup-js');

export default class EntryList extends events.EventEmitter {

    constructor(domElement) {
        super();
        this.element = domElement;
        this.setupEvents();

        this.template = `
        <table class="table table-hover">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Username</th>
                    <th>Password</th>
                    <th>Notes</th>
                </tr>
            </thead>
            <tbody>
            {{entries}}
                <tr class="entry" data-UUID="{{uuid}}" data-username="{{username}">
                    <td>
                        <span class="icon-number-{{icon}}"></span>
                        <span>{{title}}</span>
                    </td>
                    <td>{{username}}</td>
                    <td>****</td>
                    <td>{{url}}</td>
                    <td>{{notes}}</td>
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
        var self = this;
        if (!entries) {
            return;
        }

        self.element.innerHTML = Mark.up(this.template, {entries: entries});
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

