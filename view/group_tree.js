var jade = require('jade');
var events = require('events');
var util = require('util');

var gen_groups_view1 = jade.compile([
    'mixin recurse_group( groups )',
    '  li= groups',
    '    each group in groups',
    '      li.group(data-UUID="#{group.UUID}")',
    '        a',
    '          span.icon',
    '            img(src="icons/#{group.IconID}.png")',
    '          span.name #{group.Name}',
    '          ul.subgroup',
    '          +recurse_group( group.Groups )',
    '+recurse_group( groups )',
    '+recurse_group( "b" )',
    '+recurse_group( "c" )'
].join('\n'));

var gen_groups_view = jade.compile([
    'mixin recurse_group(groups)',
    '  ul.nav.nav-list',
    '    each group in groups',
    '       li.group(data-UUID="#{group.UUID}")',
    '         a.yeay #{group.Name}',
    '         if group.Groups',
    '           +recurse_group(group.Groups)',
    '+recurse_group(groups)'
].join('\n'));

function GroupTree(jquery_element) {
    events.EventEmitter.call(this);
    this.element = jquery_element;

    var self = this;

    this.element.delegate('.group', 'click', function (e) {
        console.log("self.element", self.element[0]);
        console.log("active children: ", self.element.children('.active')[0]);
        self.element.find('.active').removeClass('active');
        $(this).addClass('active');

        var uuid = $(this).attr('data-UUID');
        self.emit('navigate', {
            uuid: uuid,
            parentgroup: self
        });

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
