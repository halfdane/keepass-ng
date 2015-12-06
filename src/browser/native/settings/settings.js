import log from 'loglevel';
var nconf = require('nconf')
//.file({file: getUserHome() + '/.keepassng.json'})
        .defaults({
            lastAccessedFiles: ['./example.kdbx'],
            timeoutForConfidentialData: '10000'
        });

function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

const remember = (() => {
    function lastAccessedFile(file) {
        let lastFiles = Array.from(readSettings('lastAccessedFiles'));
        if (!!file) {
            lastFiles.push(file);
            lastFiles = [...new Set(lastFiles)];
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
            timeout = newTimeout;
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

    return {
        lastAccessedFile: lastAccessedFile,
        timeout: timeout,
        saveSettings: saveSettings,
        readSettings: readSettings
    };

})();

export { remember as default };