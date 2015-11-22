(function () {
    "use strict";

    var jade = require('jade');
    var events = require('events');
    var util = require('util');

    // Template engine
    var gen_entries_view = jade.compile([
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
        '      tr.entry(data-UUID="#{entry.uuid}")',
        '        td',
        '          span(class="icon-number-#{entry.icon}")',
        '          span #{entry.title}',
        '        td #{entry.username}',
        '        td #{entry.passwd}',
        '        td #{entry.url}',
        '        td #{entry.notes}'
    ].join('\n'));

    var getEntryValue = function (expectedString, entry) {
        var value = entry.String.filter(function (givenStringObject) {
            return givenStringObject.Key == expectedString;
        }).pop();
        if (!!value) {
            return value.Value;
        }
    };

    function EntryList(jquery_element) {
        events.EventEmitter.call(this);
        this.element = jquery_element;

        var self = this;
        // Click on blank
        this.element.parent().on('click', function () {
            self.element.find('.info').removeClass('info');
        });
        // Click on entry
        this.element.delegate('.entry', 'click', function (e) {
            self.element.find('.info').removeClass('info');
            $(this).addClass('info');
            e.stopPropagation();
        });
        // Double click on entry
        this.element.delegate('.entry', 'dblclick', function () {
            var uuid = $(this).attr('data-UUID');
            self.emit('navigate', uuid);
        });
    }

    util.inherits(EntryList, events.EventEmitter);

    function convertEntry(entry) {
        console.log("entry", entry);
        var converted = {
            title: getEntryValue('Title', entry),
            username: getEntryValue('UserName', entry),
            passwd: getEntryValue('Password', entry),
            url: getEntryValue('URL', entry),
            notes: getEntryValue('Notes', entry),
            uuid: entry.UUID,
            icon: entry.IconID,
            tags: entry.Tags
        };
        console.log("converted", converted);
        return converted;
    }


    EntryList.prototype.show = function (entries) {
        var self = this;

        if (!entries) {
            return;
        }


        self.element.html(gen_entries_view({entries: entries.map(convertEntry)}));
    };

    module.exports = EntryList;

})();
