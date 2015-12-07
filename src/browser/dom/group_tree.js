import events from 'events';
import log from 'loglevel';

import './../event/event_delegation.js';

var Mark = require('markup-js');

export default class GroupTree extends events.EventEmitter {

    constructor(domElement = document.getElementById('groups')) {
        super();
        this.element = domElement;
        this.setupEvents();

        Mark.pipes.asId = function (str) {
            return str.replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '');
        };

        Mark.includes.groupTree = `
        {{if Group}}
        <ul class="nav nav-pills nav-stacked collapse{{if toplevel}} in{{/if}}{{if IsExpanded}} in{{/if}}" role="presentation">
        {{Group}}
            <li id="{{UUID|asId}}">
                <a>
                    {{if Group}}
                    <span data-toggle="collapse" data-target=".nav #{{UUID|asId}} > .collapse">+</span>
                    {{else}}
                    <span> </span>
                    {{/if}}
                    <span class="group" data-UUID="{{UUID}}">
                      <span class="icon-number-{{IconID}}"></span>
                      <span>{{Name}}</span>
                    </span>
                </a>
                {{groupTree}}
            </li>
        {{/Group}}
        </ul>
        {{/if}}
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

    hide() {
        this.show();
    }

    show(groups) {
        this.element.innerHTML = Mark.up('{{groupTree}}', {Group: groups, toplevel: true});
        for (let item of this.element.querySelectorAll('[data-toggle="collapse"]')) {
            new Collapse(item);
        }
    }
}
