describe('Promises', () => {
    it('should resolve', done => {
        let promise = new Promise((resolve, reject) => {
            resolve('Stuff worked!');
        });

        expect(promise).to.become('Stuff worked!').and.notify(done);
    });

    it('should resolve twice', done => {
        let promise = new Promise((resolve, reject) => {
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

    it('should resolve twice but invoked ONLY ONCE (result is cached)', done => {
        let costlyFunction = sinon.stub();
        let promise = new Promise((resolve, reject) => {
            costlyFunction();
            resolve('Stuff worked!');
        });

        promise.then(s => {
                    expect(costlyFunction).to.be.calledOnce;
                    return promise;
                })
                .then(s => {
                    expect(costlyFunction).to.be.calledOnce;
                })
                .then(done)
                .catch(done);
    });

    it('should fail', done => {
        let promise = new Promise((resolve, reject) => {
            reject('Well, that was unfortunate.');
        });

        expect(promise).to.be.rejectedWith('Well, that was unfortunate.').and.notify(done);
    });
});