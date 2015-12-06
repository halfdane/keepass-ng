import log from 'loglevel';

const remember = (() => {
    var nconf;

    function lastAccessedFile(file) {
        let lastFiles = Array.from(readSettings('lastAccessedFiles'));
        if (!!file) {
            lastFiles = lastFiles.filter(f => f === file);
            lastFiles.push(file);
            if (lastFiles.length > 5) {
                lastFiles.length = 5;
            }
            saveSettings('lastAccessedFiles', lastFiles);
        }
        return lastFiles[lastFiles.length - 1];
    }

    function timeout(newTimeout) {
        let timeout = readSettings('timeoutForConfidentialData');
        if (!!newTimeout) {
            timeout = +newTimeout;
            saveSettings('timeoutForConfidentialData', timeout);
        }
        return timeout;
    }

    function saveSettings(settingKey, settingValue) {
        nconf.set(settingKey, settingValue);
        nconf.save();
    }

    function readSettings(settingKey) {
        nconf.load();
        return nconf.get(settingKey);
    }

    function toLocation(file) {
        nconf = require('nconf')
                .file({file: file})
                .defaults({
                    lastAccessedFiles: ['./example.kdbx'],
                    timeoutForConfidentialData: 10000
                });
    }

    function getUserHome() {
        return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
    }

    toLocation(getUserHome() + '/.keepassng.json');

    return {
        toLocation: toLocation,
        lastAccessedFile: lastAccessedFile,
        timeout: timeout,
        saveSettings: saveSettings,
        readSettings: readSettings
    };

})();

export { remember as default };