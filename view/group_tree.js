var jade = require('jade');
var events = require('events');
var util = require('util');

var gen_groups_view = jade.compile([
    'mixin recurse_group(groups)',
    '  ul.nav.nav-pills.nav-stacked',
    '    each group in groups',
    '       li.group(data-UUID="#{group.UUID}")',
    '         a',
    '           span(class="icon-number-#{group.IconID}")',
    '           span.name #{group.Name}',
    '         if group.Groups',
    '           +recurse_group(group.Groups)',
    'nav',
    '  +recurse_group(groups)'
].join('\n'));

function GroupTree(jquery_element) {
    this.element = jquery_element;
    var self = this;

    events.EventEmitter.call(self);

    this.element.delegate('.group', 'click', function (e) {
        self.element.find('.active').removeClass('active');
        $(this).addClass('active');

        var uuid = $(this).attr('data-UUID');
        self.emit('navigate', uuid);

        e.stopPropagation();
    });
}

util.inherits(GroupTree, events.EventEmitter);

GroupTree.prototype.show = function (groups) {
    "use strict";
    var self = this;

    self.element.html(gen_groups_view({groups: groups}));
};

exports.GroupTree = GroupTree;
