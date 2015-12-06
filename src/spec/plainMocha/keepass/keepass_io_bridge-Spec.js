import KeepassIoBridge from '../../../browser/keepass/keepass_io_bridge';

describe('KeepassIoBridge', () => {

    it('should ask promiseGenerator with username and password', done => {
        const keepassio = fakeKpio();
        const k = new KeepassIoBridge(keepassio);

        k.accessDatabase('passwd', 'path');
        k.getDatabase()
                .then(()  => {
                    expect(keepassio.password).to.have.been.calledWith('passwd');
                    expect(keepassio.loadFile).to.have.been.calledWith('path');
                })
                .then(done)
                .catch(done);

    });

});
