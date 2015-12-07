import log from 'loglevel';

describe('Protoype experiment', () => {

    class somethingWithAFunction {
        handle(func) {
            return new Promise(resolve => {
                func('Yeah');
                resolve();
            });
        }
    }

    it('should call the func parameter', done => {
        const s = new somethingWithAFunction();
        s.handle(string => {
            expect(string).to.equal('Yeah');
        }).then(done);
    });

    it('should override the handle function', done => {
        somethingWithAFunction.prototype.handle = function (callback) {
            return new Promise(resolve => {
                callback('overridden');
                resolve();
            });
        };

        const s = new somethingWithAFunction();
        s.handle(string => {
            expect(string).to.equal('overridden');
        }).then(done);
    });

    it('should call logger function', done => {
        let loggerFunction = sinon.stub();

        somethingWithAFunction.prototype.handle = function (callback) {
            return new Promise(resolve => {
                loggerFunction('overridden');
                resolve();
            });
        };

        const s = new somethingWithAFunction();
        s.handle(string => {
            expect(loggerFunction).to.be.calledOnceWith('overridden');
        }).then(done);
    });

    it('should call logger function with given error-message', done => {
        let loggerFunction = sinon.stub();

        somethingWithAFunction.prototype.handle = function (error) {
            return new Promise(resolve => {
                loggerFunction(error);
                resolve();
            });
        };

        const s = new somethingWithAFunction();
        s.handle('Some error message')
                .then(()=> {
                    expect(loggerFunction).to.be.calledWith('Some error message');
                })
                .then(done)
                .catch(done);
    });

    it('should call the func parameter again', done => {
        const s = new somethingWithAFunction();
        s.handle(string => {
            expect(string).to.equal('Yeah');
        }).then(done);
    });

    describe('Test implementation', () => {

        let loggerFunction = sinon.stub();
        beforeEach(()=> {
            loggerFunction.reset();
        });

        function isFunction(x) {
            return Object.prototype.toString.call(x) === '[object Function]';
        }

        class SomeHandlingThingie {
            handle(errorOrFunction) {
                log.debug('Orig');
                if (isFunction(errorOrFunction)) {
                    log.debug('Orig: its a function. calling it');
                    const retval = errorOrFunction('hello from the original');
                    log.debug('Orig: returning', retval);
                    return retval;
                } else {
                    log.debug('Orig: No function. Returning it directly', errorOrFunction);
                    return errorOrFunction;
                }
            }
        }

        let orig = SomeHandlingThingie.prototype.handle;
        SomeHandlingThingie.prototype.handle = function (errorOrFunction) {
            var fn = this;
            log.debug('Wrapper');
            if (!isFunction(errorOrFunction)) {
                log.debug('Wrapper: not a function. Logging.');
                loggerFunction(errorOrFunction);
                log.debug('Wrapper: not a function. Done Logging.');
            }
            log.debug('Wrapper: Calling original');
            const retval = orig.apply(this, arguments);
            log.debug('Wrapper: returning', retval);
            return retval;
        };

        it('should call logger function with given error-message', done => {
            const s = new SomeHandlingThingie();

            var result = s.handle('Some error message');
            expect(result).to.equal('Some error message');
            expect(loggerFunction).to.be.calledWith('Some error message');
            done();
        });

        it('should call call given handler-function', done => {
            const s = new SomeHandlingThingie();

            var result = s.handle(string => {
                expect(string).to.equal('hello from the original');
                return 'the given callback'
            });
            expect(result).to.equal('the given callback');
            expect(loggerFunction).to.not.be.called;
            done();
        });

    });

});