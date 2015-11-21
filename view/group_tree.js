var jade = require('jade');
var events = require('events');
var util = require('util');

var gen_groups_view = jade.compile([
    '- each group in groups',
    '  li.group(data-UUID="#{group.UUID}")',
    '    a',
    '      span.icon',
    '        img(src="icons/#{group.IconID}.png")',
    '      span.name #{group.Name}'
].join('\n'));

function Groups(jquery_element) {
    events.EventEmitter.call(this);
    this.element = jquery_element;

    var self = this;

    this.element.delegate('.group', 'click', function (e) {
        self.element.children('.active').removeClass('active');
        $(this).addClass('active');

        var uuid = $(this).attr('data-UUID');
        self.emit('navigate', uuid);

        e.stopPropagation();
    });
}

util.inherits(Groups, events.EventEmitter);

Groups.prototype.show = function (groups) {
    var self = this;
    self.element.html(gen_groups_view({groups: groups}));
};

exports.Groups = Groups;
