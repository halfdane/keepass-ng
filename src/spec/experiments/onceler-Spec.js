const TOTP = require('onceler').TOTP;

describe('OTP', () => {
    let clock;

    beforeEach(() => {
        clock = sinon.useFakeTimers(new Date(2011, 9, 1).getTime());
    });

    afterEach(() => {
        clock.restore();
    });

    it('exists', () => {
        expect(TOTP).to.exist;
    });

    it('can instantiate', () => {
        let totp = new TOTP('IFAUCQKCIJBEE===', 12, 60);
        expect(totp).to.exist;
    });

    it('creates identical tokens while in the same time window', () => {
        let totp1 = new TOTP('IFAUCQKCIJBEE===', 12, 60);
        const token1 = totp1.now();
        clock.tick(59000);
        let totp2 = new TOTP('IFAUCQKCIJBEE===', 12, 60);
        const token2 = totp2.now();
        expect(token1).to.equal(token2);
    });

    it('creates different tokens when in the different time windows', () => {
        let totp1 = new TOTP('IFAUCQKCIJBEE===', 12, 60);
        const token1 = totp1.now();

        clock.tick(60000);

        let totp2 = new TOTP('IFAUCQKCIJBEE===', 12, 60);
        const token2 = totp2.now();

        expect(token1).not.to.equal(token2);
    });

    it('recreates tokens when given the correct time', () => {
        clock = sinon.useFakeTimers(new Date(2013, 6, 12).getTime());
        let totp1 = new TOTP('IFAUCQKCIJBEE===', 12, 60);
        const token1 = totp1.now();

        clock.tick(60000000);
        let totp2 = new TOTP('IFAUCQKCIJBEE===', 12, 60);
        const token2 = totp2.now();

        clock = sinon.useFakeTimers(new Date(2013, 6, 12).getTime());
        let totp3 = new TOTP('IFAUCQKCIJBEE===', 12, 60);
        const token3 = totp3.now();

        expect(token1).not.to.equal(token2);
        expect(token1).to.equal(token3);
    });
});