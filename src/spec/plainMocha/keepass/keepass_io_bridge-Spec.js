import KeepassIoBridge from '../../../browser/keepass/keepass_io_bridge';

import log from 'loglevel';

describe('KeepassIoBridge', () => {

    let clock;
    let keepassio = sinon.stub().returns(new Promise(resolve => resolve()));

    beforeEach(() => {
        clock = sinon.useFakeTimers(new Date(2011, 9, 1).getTime());
        keepassio.reset();
    });

    afterEach(() => {
        clock.restore();
    });

    it('asks promiseGenerator with credentials', () => {
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
        const k = new KeepassIoBridge(keepassio, () => 30);

        k.accessDatabase({});
        k.getDatabase();
        k.getDatabase();
        k.getDatabase();
        expect(keepassio).to.have.been.calledOnce;
    });

    it('has no secrets accessible', () => {
        const k = new KeepassIoBridge(keepassio, () => 10);

        k.accessDatabase({password: 'masterPasswordToUnlockTheCompleteDatabase'});

        expect(k.incriminating.password).not.to.exist;
        expect(k.incriminating).not.to.contain('masterPasswordToUnlockTheCompleteDatabase');
    });

    it('drops secrets after a timeout', done => {
        const k = new KeepassIoBridge(keepassio, () => 3);

        k.accessDatabase({password: 'masterPasswordToUnlockTheCompleteDatabase'});

        log.debug('Let time run out almost completely');
        clock.tick(2999);

        log.debug('First call to the database (returning the stubbed promise)');
        k.getDatabase()
                .then(()=> {
                    log.debug('Evaluating first call - should yet be successful');
                    const firstCall = keepassio.getCall(0).args[0];
                    expect(firstCall.password).to.equal('masterPasswordToUnlockTheCompleteDatabase');
                })
                .then(() => {
                    log.debug('Let the time run out');
                    clock.tick(1);
                })
                .then(() => {
                    log.debug('drop cached database instance');
                    delete k.db;
                })
                .then(() => {
                    log.debug('Trying to access the database after timeout');
                    k.getDatabase()
                })
                .then(() => done('Expected an exception'))
                .catch(error => {
                    log.debug('Evaluating the expected error message');
                    expect(error.message).to.equal('error:06065064:digital envelope routines:EVP_DecryptFinal_ex:bad decrypt');
                    done();
                }).catch(done);
    });
});
