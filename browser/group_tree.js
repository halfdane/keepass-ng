(function () {
    "use strict";

    var jade = require('jade');
    var events = require('events');
    var util = require('util');

    require('./event_delegation.js');

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

    function GroupTree(dom_element) {
        this.element = dom_element;
        var self = this;

        events.EventEmitter.call(self);

        this.element.delegateEventListener('click', '.group', function (e) {

            Array.prototype.forEach.call(
                    self.element.getElementsByClassName('active'),
                    function (active) {
                        active.classList.remove('active')
                    });

            this.classList.add('active');

            var uuid = this.getAttribute('data-UUID');
            self.emit('navigate', uuid);

            e.stopPropagation();
        });

    }

    util.inherits(GroupTree, events.EventEmitter);

    GroupTree.prototype.show = function (groups) {
        var self = this;
        self.element.innerHTML = gen_groups_view({groups: groups});
    };

    module.exports = GroupTree;

})();