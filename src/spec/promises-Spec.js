describe('Promises', () => {
    it('should resolve', done => {
        var promise = new Promise(function (resolve, reject) {
            resolve('Stuff worked!');
        });

        expect(promise).to.become('Stuff worked!').and.notify(done);
    });

    it('should resolve twice', done => {
        var promise = new Promise(function (resolve, reject) {
            resolve('Stuff worked!');
        });

        promise.then(s => {
                    expect(s).to.equal('Stuff worked!');
                    return promise;
                })
                .then(s => {
                    expect(s).to.equal('Stuff worked!');
                    done();
                });
    });

    it('should fail', done => {
        var promise = new Promise(function (resolve, reject) {
            reject('Well, that was unfortunate.');
        });

        expect(promise).to.be.rejectedWith('Well, that was unfortunate.').and.notify(done);
    });
});