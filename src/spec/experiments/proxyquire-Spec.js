(function () {
    const proxyquire = require('proxyquire');

    describe('Proxyquire', () => {
        let foo;
        let pathStub = {};

        beforeEach(() => {
            foo = proxyquire('./proxyquire-help', {'path': pathStub});
        });

        it('when no overrides are specified, path.extname behaves normally', () => {

            expect(foo.extnameAllCaps('file.txt')).to.equal('.TXT');

        });

        it('override path.extname', () => {
            pathStub.extname = function (file) {
                return 'Exterminate, exterminate the ' + file;
            };

            // path.extname now behaves as we told it to
            expect(foo.extnameAllCaps('file.txt')).to.equal('EXTERMINATE, EXTERMINATE THE FILE.TXT');
        });

        it('path.basename and all other path module methods still function as before', () => {
            pathStub.extname = function (file) {
                return 'Exterminate, exterminate the ' + file;
            };
            expect(foo.basenameAllCaps('/a/b/file.txt')).to.equal('FILE.TXT');
        });

    });
})();