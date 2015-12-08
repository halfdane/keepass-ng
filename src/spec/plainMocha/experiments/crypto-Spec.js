var crypto = require('crypto');
describe('node-Crypto', () => {
    const plaintext = 'your secret key here, may as well be a bit longish, no worries, everything will be fine';

    it('encrypts', () => {
        let key = 'password';
        let cipher = crypto.createCipher('aes-256-cbc', key);
        let encrypted = cipher.update(plaintext, 'utf8', 'base64');
        encrypted += cipher.final('base64');

        expect(encrypted).not.to.equal(plaintext);
    });

    it('decrypts', () => {
        let key = 'password';
        let cipher = crypto.createCipher('aes-256-cbc', key);
        let encrypted = cipher.update(plaintext, 'utf8', 'base64');
        encrypted += cipher.final('base64');

        let decipher = crypto.createDecipher('aes-256-cbc', key);
        var decrypted = decipher.update(encrypted, 'base64', 'utf8');
        decrypted += decipher.final('utf8');

        expect(decrypted).to.equal(plaintext);
    });
});