import events from 'events';
import './event_delegation.js';

var Mark = require('markup-js');

export default class GroupTree extends events.EventEmitter {

    constructor(domElement = document.getElementById('groups')) {
        super();
        this.element = domElement;
        this.setupEvents();

        Mark.includes.groupTree = `
        <ul class="nav nav-pills nav-stacked">
        {{Groups}}
            <li class="group" data-UUID="{{UUID}}">
                <a>
                    <span class="icon-number-{{IconID}}"></span>
                    <span>{{Name}}</span>
                </a>
                {{if Groups}}
                    {{groupTree}}
                {{/if}}
            </li>
        {{/Groups}}
        </ul>
        `;
    }

    setupEvents() {
        this.element.addEventListener('click', event => {
            [].forEach.call(this.element.getElementsByClassName('active'),
                    el => el.classList.remove('active'));
            event.parent('.group', p => p.classList.add('active'));

            event.parent('.group',
                    e => this.emit('navigate', e.getAttribute('data-UUID')));
            event.stopPropagation();
        });
    }

    show(groups) {
        var self = this;
        if (!groups) {
            return;
        }

        self.element.innerHTML = Mark.up('{{groupTree}}', {Groups: groups});
    }
}
