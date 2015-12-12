import events from 'events';
const log = require('../logger');
import './event_delegation.js';

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
        {{Group}}
            <div class="nav" id="navOf_{{UUID|asId}}">
                {{if Group}}
                <a class="collapse-toggle {{if IsExpanded|equals>True}}collapsed{{/if}}"
                    data-toggle="collapse"
                    data-target=".groupsIn_{{UUID|asId}}"
                    role=button></a>
                {{/if}}
                <div id="{{UUID|asId}}"
                    data-UUID="{{UUID}}"
                    class="group"
                    role=button>
                        <span class="icon icon-number-{{IconID}}"></span>
                        <span>{{Name}}</span>
                </div>
                {{if Group}}
                <div class="groupsIn_{{UUID|asId}} collapse {{if IsExpanded|equals>True}}in{{/if}}">
                    {{groupTree}}
                </div>
                {{/if}}
            </div>
        {{/Group}}
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
        console.log('Got groups. Showing them');
        this.element.innerHTML = Mark.up('{{groupTree}}', {Group: groups, toplevel: true});
        for (let item of this.element.querySelectorAll('[data-toggle="collapse"]')) {
            new Collapse(item);
        }
    }
}
