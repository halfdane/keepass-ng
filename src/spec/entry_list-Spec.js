import EntryList from '../browser/entry_list';

describe('EntryList', () => {

    describe('html creation', () => {

        beforeEach(function () {
            var fixture = '<div id="fixture"><div id="testElement"></div></div>';
            document.body.insertAdjacentHTML('afterbegin', fixture);
        });

        afterEach(function () {
            document.body.removeChild(document.getElementById('fixture'));
        });

        function createEntry(n = 1) {
            return {
                title: `t${n}`,
                username: `username${n}`,
                password: `passwd${n}`,
                url: `url${n}`,
                notes: `notes${n}`,
                uuid: `uuid${n}`,
                icon: `iconid${n}`,
                tags: `tags${n}`
            };
        }

        function checkEntry(createdString, n = 1) {
            expect(createdString).to.have.string(`t${n}`);
            expect(createdString).to.have.string(`username${n}`);
            expect(createdString).not.to.have.string(`passwd${n}`);
            expect(createdString).to.have.string(`url${n}`);
            expect(createdString).to.have.string(`notes${n}`);
            expect(createdString).to.have.string(`uuid${n}`);
            expect(createdString).to.have.string(`iconid${n}`);
        }

        it('should exist', () => {
            expect(EntryList).to.exist;
        });

        it('should be instantiated', () => {
            var entryList = new EntryList(document.getElementById('testElement'));
            expect(entryList).to.exist;
        });

        it('should display one entry-value without password', () => {
            var entryList = new EntryList(document.getElementById('testElement'));
            entryList.show([
                createEntry()
            ]);

            var generatedHtml = document.getElementById('testElement').innerHTML;
            checkEntry(generatedHtml);
        });

        it('should display multiple entry-values without passwords', () => {
            var entryList = new EntryList(document.getElementById('testElement'));
            entryList.show([
                createEntry(1),
                createEntry(2),
                createEntry(3),
                createEntry(4)
            ]);

            var generatedHtml = document.getElementById('testElement').innerHTML;
            checkEntry(generatedHtml, 1);
            checkEntry(generatedHtml, 2);
            checkEntry(generatedHtml, 3);
            checkEntry(generatedHtml, 4);
        });
    });

    describe('click events', () => {
        beforeEach(function () {
            var fixture = `<div id="fixture"><div id="testElement">
                        <div id="entry1" class="entry" data-UUID="someUuid"></div>
                        <div id="entry2" class="entry info"></div>
            </div></div>`;
            document.body.insertAdjacentHTML('afterbegin', fixture);
        });

        afterEach(function () {
            document.body.removeChild(document.getElementById('fixture'));
        });

        it('should activate clicked entry', ()=> {
            new EntryList(document.getElementById('testElement'));
            var inactiveEntry = document.getElementById('entry1');

            expect(inactiveEntry).not.to.have.class('info');
            inactiveEntry.click();
            //expect(inactiveEntry).to.have.class('info');
        });

        it('should deactivate entry when clicking somewhere else', ()=> {
            new EntryList(document.getElementById('testElement'));
            var activeEntry = document.getElementById('entry2');
            expect(activeEntry).to.have.class('info');

            // when
            document.getElementById('testElement').click();
            expect(activeEntry).not.to.have.class('info');
        });

        it('should trigger navigation event when double clicking on entry', () => {
            var eventSpy = sinon.spy();
            var entryList = new EntryList(document.getElementById('testElement'));
            entryList.on('navigate', eventSpy);

            // when
            document.getElementById('entry1').dblclick();
            expect(eventSpy).to.have.been.calledWith('someUuid');
            expect(eventSpy).to.have.been.calledOnce;
        });

    });

    describe('information retrieval', () => {
        beforeEach(function () {
            var fixture = `<div id="fixture">
            <div id="testElement">
                        <div id="entry1" class="entry info"
                        data-UUID="someUuid"
                        data-username="someUsername"
                        ></div>
            </div></div>`;
            document.body.insertAdjacentHTML('afterbegin', fixture);
        });

        afterEach(function () {
            document.body.removeChild(document.getElementById('fixture'));
        });

        it('should return id of active entry', ()=> {
            var entryList = new EntryList(document.getElementById('testElement'));
            var myEntry = document.getElementById('entry1');
            expect(myEntry.classList.contains('info')).to.be.true;

            // when
            var idOfActiveEntry = entryList.getIdOfActiveEntry();

            // then
            expect(idOfActiveEntry).to.equal('someUuid');
        });

        it('should return username of active entry', ()=> {
            var entryList = new EntryList(document.getElementById('testElement'));
            var myEntry = document.getElementById('entry1');
            expect(myEntry.classList.contains('info')).to.be.true;

            // when
            var usernameOfActiveEntry = entryList.getUsernameOfActiveEntry();

            // then
            expect(usernameOfActiveEntry).to.equal('someUsername');
        });
    });

});