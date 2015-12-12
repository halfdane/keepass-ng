import GroupTree from '../../browser/dom/group_tree';

describe('GroupTree', () => {

    describe('html creation', () => {

        beforeEach(function () {
            var fixture = '<div id="fixture"><div id="testElement"></div></div>';
            document.body.insertAdjacentHTML('afterbegin', fixture);
        });

        afterEach(function () {
            document.body.removeChild(document.getElementById('fixture'));
        });

        function createGroup(n = 1, subGroups = []) {
            var group = {
                Name: `name${n}`,
                UUID: `uuid${n}`,
                IconID: `iconid${n}`,
                Group: []
            };
            subGroups.forEach(g => group.Group.push(g));

            return group;
        }

        function checkGroup(n = 1, element = document.getElementById('testElement')) {
            expect(element).to.contain.text([`name${n}`]);

            expect(element).not.to.contain.text(`uuid${n}`);
            expect(element).to.contain.html(`uuid${n}`);

            expect(element).not.to.contain.text(`iconid${n}`);
            expect(element).to.contain.html(`iconid${n}`);
        }

        it('should exist', () => {
            expect(GroupTree).to.exist;
        });

        it('should be instantiated', () => {
            var groupTree = new GroupTree(document.getElementById('testElement'));
            expect(groupTree).to.exist;
        });

        it('should display one group without child', () => {
            var groupTree = new GroupTree(document.getElementById('testElement'));
            groupTree.show([createGroup()]);
            checkGroup();
        });

        it('should display multiple groups without children', () => {
            var groupTree = new GroupTree(document.getElementById('testElement'));
            groupTree.show([
                createGroup(1),
                createGroup(2),
                createGroup(3),
                createGroup(4)
            ]);

            checkGroup(1);
            checkGroup(2);
            checkGroup(3);
            checkGroup(4);
        });

        it('should display one group with single child', () => {
            var groupTree = new GroupTree(document.getElementById('testElement'));
            var group1 = createGroup(1, [createGroup(2)]);
            groupTree.show([group1]);

            checkGroup(1);
            checkGroup(2);
            expect(document.getElementById('testElement')).to.contain('.nav .group');
            expect(document.getElementById('testElement')).to.contain('.nav .nav .group');
        });

        it('should display one group with multiple children (and one subchild)', () => {
            var groupTree = new GroupTree(document.getElementById('testElement'));
            var group1 = createGroup('parent', [createGroup(1), createGroup(2, [createGroup(3)])]);
            groupTree.show([group1]);

            checkGroup('parent');
            checkGroup(1);
            checkGroup(2);
            checkGroup(3);

            var parentGroup = document.getElementById('navOf_uuidparent');
            var firstChild = document.getElementById('navOf_uuid1');
            var secondChild = document.getElementById('navOf_uuid2');
            var thirdChild = document.getElementById('navOf_uuid3');

            expect(parentGroup).to.contain(firstChild);
            expect(parentGroup).to.contain(secondChild);
            expect(parentGroup).to.contain(thirdChild);

            expect(firstChild).not.to.contain(secondChild);
            expect(firstChild).not.to.contain(thirdChild);
            expect(secondChild).to.contain(thirdChild);
        });

        it('should display pretty complex tree with multiple groups and multiple children', () => {
            var groupTree = new GroupTree(document.getElementById('testElement'));
            var group1 = createGroup('1',
                    [createGroup('1_1', [createGroup('1_1_1')]), createGroup('1_2'), createGroup('1_3', [createGroup('1_3_1')])]
            );
            var group2 = createGroup('2',
                    [createGroup('2_1'), createGroup('2_2', [createGroup('2_2_1')]), createGroup('2_3', [createGroup('2_3_1')])]
            );

            groupTree.show([group1, group2]);

            expect(document.getElementById('navOf_uuid1')).to.contain(document.getElementById('navOf_uuid1_1'));
            expect(document.getElementById('navOf_uuid1')).to.contain(document.getElementById('navOf_uuid1_1_1'));
            expect(document.getElementById('navOf_uuid1')).to.contain(document.getElementById('navOf_uuid1_2'));
            expect(document.getElementById('navOf_uuid1')).to.contain(document.getElementById('navOf_uuid1_3'));
            expect(document.getElementById('navOf_uuid1')).to.contain(document.getElementById('navOf_uuid1_3_1'));

            expect(document.getElementById('navOf_uuid2')).to.contain(document.getElementById('navOf_uuid2_1'));
            expect(document.getElementById('navOf_uuid2')).to.contain(document.getElementById('navOf_uuid2_2'));
            expect(document.getElementById('navOf_uuid2')).to.contain(document.getElementById('navOf_uuid2_2_1'));
            expect(document.getElementById('navOf_uuid2')).to.contain(document.getElementById('navOf_uuid2_3'));
            expect(document.getElementById('navOf_uuid2')).to.contain(document.getElementById('navOf_uuid2_3_1'));
        });
    });

    describe('click events', () => {
        beforeEach(function () {
            var fixture = `<div id="fixture"><div id="testElement">
                        <div id="group1" class="group" data-UUID="someUuid"></div>
                        <div id="group2" class="group active"></div>
            </div></div>`;
            document.body.insertAdjacentHTML('afterbegin', fixture);
        });

        afterEach(function () {
            document.body.removeChild(document.getElementById('fixture'));
        });

        it('should activate clicked group', ()=> {
            new GroupTree(document.getElementById('testElement'));
            var inactiveGroup = document.getElementById('group1');

            expect(inactiveGroup).not.to.have.class('active');
            inactiveGroup.click();
            expect(inactiveGroup).to.have.class('active');
        });

        it('should trigger navigation event when double clicking on group', ()=> {
            var eventSpy = sinon.spy();
            var groupTree = new GroupTree(document.getElementById('testElement'));
            groupTree.on('navigate', eventSpy);

            // when
            document.getElementById('group1').click();
            expect(eventSpy).to.have.been.calledWith('someUuid');
            expect(eventSpy).to.have.been.calledOnce;
        });

    });
});