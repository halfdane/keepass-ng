var jade = require('jade');
var events = require('events');
var util = require('util');

// Template engine
var gen_entries_view = jade.compile([
    '- each entry in entries',
    '  .entry(data-path="#{entry.title}")',
    '    .icon',
    '      img(src="icons/#{entry.username}.png")',
    '    .name #{entry.title}'
].join('\n'));

// Our type
function Entry(jquery_element) {
    "use strict";

    events.EventEmitter.call(this);
    this.element = jquery_element;

    var self = this;
    // Click on blank
    this.element.parent().on('click', function () {
        self.element.children('.focus').removeClass('focus');
    });
    // Click on entry
    this.element.delegate('.file', 'click', function (e) {
        self.element.children('.focus').removeClass('focus');
        $(this).addClass('focus');
        e.stopPropagation();
    });
    // Double click on entry
    this.element.delegate('.file', 'dblclick', function () {
        var file_path = $(this).attr('data-path');
        self.emit('navigate', file_path, mime.stat(file_path));
    });
}

util.inherits(Entry, events.EventEmitter);

var getEntryString = function (expectedString) {
    return function (givenStringObject) {
        "use strict";
        return givenStringObject.Key == expectedString;
    }
};

Entry.prototype.show = function (entries) {
    "use strict";

    var self = this;

    if (!entries) {
        return;
    }

    entries = entries.map(function (entry) {
        return {
            title: entry.String.filter(getEntryString('Title')).pop().Value,
            username: entry.String.filter(getEntryString('UserName')).pop().Value,
            passwd: entry.String.filter(getEntryString('Password')).pop().Value
        }
    });

    self.element.html(gen_entries_view({entries: entries}));
};

exports.Entry = Entry;
