const log = require('./logger');

const remember = (() => {
    const LAST_ACCESSED_FILES = 'lastAccessedFiles';
    const TIMEOUT_FOR_CONFIDENTIAL_DATA = 'timeoutForConfidentialData';

    const DEFAULTS = {
        [LAST_ACCESSED_FILES]: ['./example.kdbx'],
        [TIMEOUT_FOR_CONFIDENTIAL_DATA]: 5 * 60 * 1000
    };
    let nconf;

    function lastAccessedFile(file) {
        let lastFiles = Array.from(readSettings(LAST_ACCESSED_FILES));
        if (!!file) {
            lastFiles = lastFiles.filter(f => f === file);
            lastFiles.push(file);
            if (lastFiles.length > 5) {
                lastFiles.length = 5;
            }
            saveSettings(LAST_ACCESSED_FILES, lastFiles);
        }
        return lastFiles[lastFiles.length - 1];
    }

    function timeout(newTimeout) {
        let timeout = readSettings(TIMEOUT_FOR_CONFIDENTIAL_DATA);
        if (!!newTimeout) {
            timeout = +newTimeout;
            saveSettings(TIMEOUT_FOR_CONFIDENTIAL_DATA, timeout);
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
                .defaults(DEFAULTS);
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