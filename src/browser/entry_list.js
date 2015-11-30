import jade from 'jade';
import events from 'events';
import util from 'util';
import {each} from './event_delegation.js';

export default class EntryList extends events.EventEmitter {

    constructor(domElement) {
        super();
        this.element = domElement;
        this.setupEvents();

        this.genEntriesView = jade.compile([
            'table.table.table-hover',
            '  thead',
            '    tr',
            '      th Title',
            '      th  Username',
            '      th  Password',
            '      th  Url',
            '      th  Notes',
            '  tbody',
            '    - each entry in entries',
            '      tr.entry(data-UUID="#{entry.uuid}", data-username="#{entry.username}")',
            '        td',
            '          span(class="icon-number-#{entry.icon}")',
            '          span #{entry.title}',
            '        td #{entry.username}',
            '        td *****',
            '        td #{entry.url}',
            '        td #{entry.notes}'
        ].join('\n'));

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

        self.element.innerHTML = this.genEntriesView({entries: entries});
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

