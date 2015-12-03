import MainView from '../browser/main_view';

describe('MainView', () => {

    beforeEach(function () {
        var fixture = '<div id="fixture"><div id="entries"></div><div id="groups"></div></div>';
        document.body.insertAdjacentHTML('afterbegin', fixture);
    });

    afterEach(function () {
        document.body.removeChild(document.getElementById('fixture'));
    });

    it('should exist', () => {
        expect(MainView).to.exist;
    });

    it('should be instantiated', () => {
        const keepassFake = {
            getDatabaseGroups: sinon.stub().callsArg(0)
        };
        const mainView = new MainView(undefined, keepassFake);
        expect(mainView).to.exist;
    });

    it('should be instantiated', () => {
        const keepassFake = {getDatabaseGroups: sinon.stub().callsArg(0)};

        const mainView = new MainView(undefined, keepassFake);

        expect(mainView).to.exist;
    });

    it('should register on grouptree', () => {
        const keepassFake = {getDatabaseGroups: sinon.stub().callsArgWith(0, [])};
        const fakeGroupTree = {on: sinon.stub(), show: sinon.stub()};

        new MainView(undefined, keepassFake, fakeGroupTree);

        expect(fakeGroupTree.on).to.have.been.calledWith('navigate');
        expect(fakeGroupTree.show).to.have.been.calledWith([]);
    });

    it('should register on entrylist', () => {
        const keepassFake = {getDatabaseGroups: sinon.stub().callsArgWith(0, [])};
        const fakeEntryList = {on: sinon.stub(), show: sinon.stub()};

        new MainView(undefined, keepassFake, undefined, fakeEntryList);

        expect(fakeEntryList.on).to.have.been.calledWith('navigate');
    });

});