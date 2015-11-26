import EntryList from '../browser/entry_list';

describe('app test', () => {

    // inject the HTML fixture for the tests
    beforeEach(function() {
        var fixture = '<div id="testElement"></div>';
        document.body.insertAdjacentHTML('afterbegin', fixture);
    });

    // remove the html fixture from the DOM
    afterEach(function() {
        document.body.removeChild(document.getElementById('fixture'));
    });

    it('should load correct url', () => {
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

        // then
        expect(document.getElementById('testElement')).toContain('username1');
    });
});