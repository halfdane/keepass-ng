(function () {

    const crypto = require('crypto');
    const TOTP = require('onceler').TOTP;

    // yes, this is much more secret than an empty string (he mumbled to himself)
    const secret = 'UHEiO2p5LSVqezo1KW5eLCBFPi4=';

    module.exports.encrypt = function (timeWindow, plaintext) {
        let encrypted;
        if (!!plaintext) {
            const otp = new TOTP(secret, 12, timeWindow).now().toString();
            const key = crypto.createHash('sha256').update(otp).digest('hex');

            let cipher = crypto.createCipher('aes-256-cbc', key);
            encrypted = cipher.update(plaintext, 'utf8', 'base64');
            encrypted += cipher.final('base64');
        }
        return encrypted;
    };

    module.exports.decrypt = function (timeWindow, encrypted) {
        let decrypted;
        if (!!encrypted) {
            const otp = new TOTP(secret, 12, timeWindow).now().toString();
            const key = crypto.createHash('sha256').update(otp).digest('hex');

            let decipher = crypto.createDecipher('aes-256-cbc', key);
            decrypted = decipher.update(encrypted, 'base64', 'utf8');
            decrypted += decipher.final('utf8');
        }
        return decrypted;
    };

})();