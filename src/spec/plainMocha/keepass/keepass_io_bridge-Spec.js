import KeepassIoBridge from '../../../browser/keepass/keepass_io_bridge';

function fakeKpio() {
    let fake = {};
    fake.loadFile = sinon.stub().callsArg(1);
    fake.password = sinon.spy();
    fake.Database = () => {
        return {
            'addCredential': sinon.spy(),
            'loadFile': fake.loadFile,
            'getRawApi': () => {
                return {
                    get: () => {
                        return {KeePassFile: {}};
                    }
                };
            }
        };
    };
    fake.Credentials = {
        'Password': fake.password
    };
    return fake;
}
describe('KeepassIoBridge', () => {

    it('should use provided path and password', done => {
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
