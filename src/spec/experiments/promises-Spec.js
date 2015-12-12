describe('A Promise', () => {
    it('resolves', done => {
        let promise = new Promise((resolve, reject) => {
            resolve('Stuff worked!');
        });

        expect(promise).to.become('Stuff worked!').and.notify(done);
    });

    it('resolves twice', done => {
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

    it('resolves twice but is invoked ONLY ONCE (result is cached)', done => {
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

    it('fails', done => {
        let promise = new Promise((resolve, reject) => {
            reject('Well, that was unfortunate.');
        });

        expect(promise).to.be.rejectedWith('Well, that was unfortunate.').and.notify(done);
    });

    describe('with fake timers', () => {
        let clock;

        beforeEach(() => {
            const date = new Date(2011, 9, 1);
            clock = sinon.useFakeTimers(date.getTime());
        });

        afterEach(() => {
            clock.restore();
        });

        it('can fake time', () => {
            const startTime = new Date().getTime();

            clock.tick(5000);
            expect(new Date().getTime()).to.equal(startTime + 5000);
            clock.tick(5000);
            expect(new Date().getTime()).to.equal(startTime + 10000);
            clock.tick(5000);
            expect(new Date().getTime()).to.equal(startTime + 15000);
            clock.restore();
        });

        it('can delete something after timeout', () => {
            let info = {hideMe: 'afterTimeout'};

            setTimeout(x=> {
                delete info.hideMe;
            }, 10);

            clock.tick(9);
            expect(info.hideMe).to.exist;
            clock.tick(1);
            expect(info.hideMe).not.to.exist;
        });

        it('can resolve a promise after timeout', () => {
            let timer = setTimeout;
            var promise = new Promise(function (resolve) {
                timer(resolve, 1000);
            });

            clock.tick(1001);

            return expect(promise).to.have.been.fulfilled;
        });
    });
});
