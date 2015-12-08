(function () {

    const crypto = require('crypto');

    module.exports.encrypt = function (totp, plaintext) {
        const key = crypto.createHash('sha256').update(totp.now().toString()).digest('hex');

        let cipher = crypto.createCipher('aes-256-cbc', key);
        let encrypted = cipher.update(plaintext, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return encrypted;
    };

    module.exports.decrypt = function (totp, encrypted) {
        const key = crypto.createHash('sha256').update(totp.now().toString()).digest('hex');

        let decipher = crypto.createDecipher('aes-256-cbc', key);
        var decrypted = decipher.update(encrypted, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    };

})();