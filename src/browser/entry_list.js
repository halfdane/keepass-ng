(function () {
    'use strict';

    var jade = require('jade');
    var events = require('events');
    var util = require('util');
    //require('./event_delegation.js');

    // Template engine
    var genEntriesView = jade.compile([
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

    function EntryList(domElement) {
        events.EventEmitter.call(this);
        this.element = domElement;

        var self = this;
        // Click on blank
        this.element.parentNode.addEventListener('click', function () {

            Array.prototype.forEach.call(
                    self.element.getElementsByClassName('info'),
                    function (selectedElement) {
                        selectedElement.classList.remove('info');
                    });
        });

        this.element.delegateEventListener('click', '.entry', function (e) {
            Array.prototype.forEach.call(
                    self.element.getElementsByClassName('info'),
                    function (selectedElement) {
                        selectedElement.classList.remove('info');
                    });

            this.classList.add('info');
            e.stopPropagation();
        });

        this.element.delegateEventListener('dblclick', '.entry', function (e) {
            var uuid = this.getAttribute('data-UUID');
            self.emit('navigate', uuid);
            e.stopPropagation();
        });
    }

    util.inherits(EntryList, events.EventEmitter);

    EntryList.prototype.show = function (entries) {
        var self = this;
        if (!entries) {
            return;
        }
        self.element.innerHTML = genEntriesView({entries: entries});
    };

    EntryList.prototype.getIdOfActiveEntry = function () {
        var self = this;
        return self.element.getElementsByClassName('info').item(0).getAttribute('data-UUID');
    };
    EntryList.prototype.getUsernameOfActiveEntry = function () {
        var self = this;
        return self.element.getElementsByClassName('info').item(0).getAttribute('data-username');
    };

    module.exports = EntryList;

})();
