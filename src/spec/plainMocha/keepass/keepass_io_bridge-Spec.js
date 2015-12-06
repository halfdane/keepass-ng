import KeepassIoBridge from '../../../browser/keepass/keepass_io_bridge';

import log from 'loglevel';

describe('KeepassIoBridge', () => {

    it('asks promiseGenerator with credentials', () => {
        const keepassio = sinon.spy();
        const k = new KeepassIoBridge(keepassio, () => 3);

        k.accessDatabase({dbfile: 'some/file', password: 'somePassword', keyfile: 'some/keyfile'});
        k.getDatabase();

        const info = keepassio.getCall(0).args[0];
        expect(info.dbfile).to.equal('some/file');
        expect(info.password).to.equal('somePassword');
        expect(info.keyfile).to.equal('some/keyfile');
        expect(keepassio).to.have.been.calledOnce;
    });

    it('caches calls to keepassio', () => {
        const keepassio = sinon.stub().returns('something');
        const k = new KeepassIoBridge(keepassio, () => 30);

        k.accessDatabase({});
        k.getDatabase();
        k.getDatabase();
        k.getDatabase();
        expect(keepassio).to.have.been.calledOnce;
    });

    it('hmm great, has secrets globally accessible :/', () => {
        const keepassio = sinon.stub().returns('something');
        const k = new KeepassIoBridge(keepassio, () => 10);

        k.accessDatabase({password: 'masterPasswordToUnlockTheCompleteDatabase'});

        expect(k.incriminating.password).to.equal('masterPasswordToUnlockTheCompleteDatabase');
    });

    it('drops secrets after a timeout', done => {
        const keepassio = sinon.stub().returns('something');
        const k = new KeepassIoBridge(keepassio, () => 3);

        k.accessDatabase({password: 'masterPasswordToUnlockTheCompleteDatabase'});
        expect(k.incriminating.password).to.equal('masterPasswordToUnlockTheCompleteDatabase');
        setTimeout(x=> {
            expect(k.incriminating.password).not.to.exist;
            done();
        }, 4)
    });
});
