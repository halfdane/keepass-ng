import EntryList from '../browser/entry_list';

describe('dom', () => {
    it('should exist', () => {
        expect( document ).to.exist;
    });
    it('its body should exist', () => {
        expect( document.body ).to.exist;
    });
    it('should be able to append to and remove from body', () => {
        var fixture = '<div id="fixture"><div id="testElement"></div></div>';

        expect(document.getElementById('fixture')).not.to.exist;

        document.body.insertAdjacentHTML('afterbegin', fixture);
        expect(document.getElementById('fixture')).to.exist;

        document.body.removeChild(document.getElementById('fixture'));
        expect(document.getElementById('fixture')).not.to.exist;
    });
});


describe('fixture', () => {

    beforeEach(function() {
        var fixture = '<div id="fixture"><div id="testElement"></div></div>';
        document.body.insertAdjacentHTML('afterbegin', fixture);
    });

    afterEach(function() {
        document.body.removeChild(document.getElementById('fixture'));
    });

    it('should exist', () => {
        expect(document.getElementById('fixture')).to.exist;
    });

    it('test element should exist', () => {
        expect(document.getElementById('testElement')).to.exist;
    });
});

describe('EntryList', () => {

    beforeEach(function() {
        var fixture = '<div id="fixture"><div id="testElement"></div></div>';
        document.body.insertAdjacentHTML('afterbegin', fixture);
    });

    afterEach(function() {
        document.body.removeChild(document.getElementById('fixture'));
    });

    it('should exist', () => {
        expect(EntryList).to.exist;
    });

    it('should be instantiated', () => {
        var entryList = new EntryList(document.getElementById('testElement'));
        expect(entryList).to.exist;
    });

    it('should display entry-value', () => {
        var entryList = new EntryList(document.getElementById('testElement'));
        entryList.show([
            {
                title: 't1',
                username: 'username1',
                password: 'passwd1',
                url: 'url1',
                notes: 'notes1',
                uuid: 'uuid1',
                icon: 'iconid1',
                tags: 'tags1'
            }
        ]);

        var generatedHtml = document.getElementById('testElement').innerHTML;
        expect( generatedHtml ).to.match( /t1/ );
        expect( generatedHtml ).to.match( /username1/ );
        expect( generatedHtml ).not.to.match( /passwd1/ );
        expect( generatedHtml ).to.match( /url1/ );
        expect( generatedHtml ).to.match( /notes1/ );
        expect( generatedHtml ).to.match( /uuid1/ );
        expect( generatedHtml ).to.match( /iconid1/ );
    });
});