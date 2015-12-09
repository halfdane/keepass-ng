describe('in combination with onceler', () => {
    const TOTP = require('onceler').TOTP;

    const encrypt = require('../../../browser/keepass/obfuscate').encrypt;
    const decrypt = require('../../../browser/keepass/obfuscate').decrypt;

    const plaintext = 'your secret key here, may as well be a bit longish, no worries, everything will be fine';

    let totp;
    let clock;

    beforeEach(() => {
        totp = new TOTP('IFAUCQKCIJBEE===', 12, 60);
        clock = sinon.useFakeTimers(new Date(2011, 9, 1).getTime());
    });

    afterEach(() => {
        clock.restore();
    });

    it('works without clock ticks', () => {
        const encrypted = encrypt(totp, plaintext);
        const decrypted = decrypt(totp, encrypted);

        expect(encrypted).not.to.equal(plaintext);
        expect(decrypted).to.equal(plaintext);
    });

    it('works with clock ticks', () => {
        const encrypted = encrypt(totp, plaintext);
        clock.tick(59000);
        const decrypted = decrypt(totp, encrypted);

        expect(encrypted).not.to.equal(plaintext);
        expect(decrypted).to.equal(plaintext);
    });

    it('times out', done => {
        const encrypted = encrypt(totp, plaintext);
        clock.tick(60000);
        try {
            decrypt(totp, encrypted);
            done('Expected an exception');
        } catch (error) {
            done();
        }
    });
});
