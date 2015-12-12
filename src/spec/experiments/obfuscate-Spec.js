describe('in combination with onceler', () => {

    const encrypt = require('../../browser/keepass/obfuscate').encrypt;
    const decrypt = require('../../browser/keepass/obfuscate').decrypt;

    const plaintext = 'your secret key here, may as well be a bit longish, no worries, everything will be fine';

    let clock;

    beforeEach(() => {
        clock = sinon.useFakeTimers(new Date(2011, 9, 1).getTime());
    });

    afterEach(() => {
        clock.restore();
    });

    it('works without clock ticks', () => {
        const encrypted = encrypt(60, plaintext);
        const decrypted = decrypt(60, encrypted);

        expect(encrypted).not.to.equal(plaintext);
        expect(decrypted).to.equal(plaintext);
    });

    it('works with clock ticks', () => {
        const encrypted = encrypt(60, plaintext);
        clock.tick(59000);
        const decrypted = decrypt(60, encrypted);

        expect(encrypted).not.to.equal(plaintext);
        expect(decrypted).to.equal(plaintext);
    });

    it('times out', done => {
        const encrypted = encrypt(60, plaintext);
        clock.tick(60000);
        try {
            decrypt(60, encrypted);
            done('Expected an exception');
        } catch (error) {
            done();
        }
    });
});
