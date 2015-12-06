import fs from 'fs';
import log from 'loglevel';
import remember from '../../../browser/native/settings';

describe('Remember function', () => {
    const TESTFILE = './test.json';
    beforeEach(()=> {
        remember.toLocation(TESTFILE);
    });
    afterEach(()=> {
        try {
            fs.unlinkSync(TESTFILE);
        } catch (err) {
            // someone didn't create a file?
            log.debug(err);
        }
    });

    it('stores entries', () => {
        remember.saveSettings('someKey', 'someValue');

        const config = JSON.parse(fs.readFileSync(TESTFILE, 'UTF-8'));
        expect(config).to.deep.equal({someKey: 'someValue'});
    });

    it('reads entries', () => {
        fs.writeFileSync(TESTFILE, '{"whatIWant":"what i need"}', 'utf8');
        const conf = remember.readSettings('whatIWant');
        expect(conf).to.equal('what i need');
    });

    it('has some sane defaults', () => {
        expect(remember.timeout()).to.equal(300000);
        expect(remember.lastAccessedFile()).to.equal('./example.kdbx');
    });

    it('remembers new timeout instead of the default', () => {
        remember.timeout(1010);
        expect(remember.timeout()).to.equal(1010);
    });

    it('stores new timeout into the filesystem', () => {
        remember.timeout(1020);
        const config = JSON.parse(fs.readFileSync(TESTFILE, 'UTF-8'));
        expect(config.timeoutForConfidentialData).to.equal(1020);
    });

    it('converts timeout to string before remembering', () => {
        remember.timeout('1030');
        expect(remember.timeout()).to.equal(1030);
    });

    it('remembers file', () => {
        remember.lastAccessedFile('some file');
        expect(remember.lastAccessedFile()).to.equal('some file');
    });

    it('stores remembered file to filesystem', () => {
        remember.lastAccessedFile('some file in fs');
        const config = JSON.parse(fs.readFileSync(TESTFILE, 'UTF-8'));
        expect(config.lastAccessedFiles).to.deep.equal(['some file in fs']);
    });

    it('doesn\'t remember duplicate files twice', () => {
        remember.lastAccessedFile('some file in fs');
        remember.lastAccessedFile('some file in fs');
        remember.lastAccessedFile('./example.kdbx');
        remember.lastAccessedFile('some file in fs');
        const config = JSON.parse(fs.readFileSync(TESTFILE, 'UTF-8'));
        expect(config.lastAccessedFiles).to.deep.equal(['some file in fs']);
    });

    it('remembers the last file of multiples', () => {
        remember.lastAccessedFile('some file 1');
        remember.lastAccessedFile('some file 2');
        remember.lastAccessedFile('some file 3');
        expect(remember.lastAccessedFile()).to.equal('some file 3');
    });

    it('remembers the last file even it was already remembered', () => {
        remember.lastAccessedFile('some file 1');
        remember.lastAccessedFile('some file 2');
        remember.lastAccessedFile('some file 1');
        expect(remember.lastAccessedFile()).to.equal('some file 1');
    });

});
