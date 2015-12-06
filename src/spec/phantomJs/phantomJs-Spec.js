describe('dom', () => {
    it('should exist', () => {
        expect(document).to.exist;
    });
    it('its body should exist', () => {
        expect(document.body).to.exist;
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
    beforeEach(function () {
        var fixture = '<div id="fixture"><div id="testElement"></div></div>';
        document.body.insertAdjacentHTML('afterbegin', fixture);
    });

    afterEach(function () {
        document.body.removeChild(document.getElementById('fixture'));
    });

    it('should exist', () => {
        expect(document.getElementById('fixture')).to.exist;
    });

    it('test element should exist', () => {
        expect(document.getElementById('testElement')).to.exist;
    });
});
