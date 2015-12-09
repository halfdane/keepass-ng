(function () {
    const log = require('loglevel');
    const TOTP = require('onceler').TOTP;

    const walker = require('../../../browser/keepass/keepass_walker');
    const sanitizeDb = walker.sanitizeDb;
    const getString = walker.getString;
    const matches = walker.matches;
    const entryWith = walker.entryWith;

    const timeout = 3;

    describe('KeepassWalker', ()=> {

        let clock;
        let totp;
        let testDatabase;

        beforeEach(() => {
            clock = sinon.useFakeTimers(new Date(2011, 9, 1).getTime());
            totp = new TOTP('IFAUCQKCIJBEE===', 12, 3);
            testDatabase = JSON.parse(JSON.stringify(require('./exampledb.json')));
        });

        afterEach(() => {
            clock.restore();
        });

        it('transforms single group without entries or subgroups', done => {
            sanitizeDb(totp)(testDatabase.KeePassFile.Root.Group.Group[0])
                    .then(({database: transformedGroup}) => {
                        expect(transformedGroup.UUID).to.equal('wXlnHFx+T0mHRYtNN+WgJg==');
                        expect(transformedGroup.Name).to.equal('General');
                        expect(transformedGroup.Notes).to.equal('');
                        expect(transformedGroup.IconID).to.equal('48');
                        expect(transformedGroup.Times.CreationTime).to.equal('2013-11-11T18:49:01Z');
                        expect(transformedGroup.Times.LastModificationTime).to.equal('2013-11-11T18:49:01Z');
                        expect(transformedGroup.Times.LastAccessTime).to.equal('2015-11-21T10:40:34Z');
                        expect(transformedGroup.Times.ExpiryTime).to.equal('2013-11-11T18:47:58Z');
                        expect(transformedGroup.Times.Expires).to.equal('False');
                        expect(transformedGroup.Times.UsageCount).to.equal('1');
                        expect(transformedGroup.Times.LocationChanged).to.equal('2013-11-11T18:49:01Z');
                        expect(transformedGroup.IsExpanded).to.equal('True');
                        expect(transformedGroup.DefaultAutoTypeSequence).to.equal('');
                        expect(transformedGroup.EnableAutoType).to.equal('null');
                        expect(transformedGroup.EnableSearching).to.equal('null');
                        expect(transformedGroup.LastTopVisibleEntry).to.equal('AAAAAAAAAAAAAAAAAAAAAA==');

                        expect(transformedGroup.Entry).not.to.exist;
                        expect(transformedGroup.Group).not.to.exist;
                    })
                    .then(done)
                    .catch(done);
        });

        it('transforms single group with entries', done => {
            sanitizeDb(totp)(testDatabase.KeePassFile.Root.Group.Group[1])
                    .then(({database: database}) => {
                        const transformedGroup = database;

                        expect(transformedGroup.UUID).to.equal('PtfRMFDAvkeQBJ/VTfhJ2Q==');
                        expect(transformedGroup.Name).to.equal('Windows');
                        expect(transformedGroup.Notes).to.equal('');
                        expect(transformedGroup.IconID).to.equal('38');
                        expect(transformedGroup.IsExpanded).to.equal('True');
                        expect(transformedGroup.DefaultAutoTypeSequence).to.equal('');
                        expect(transformedGroup.EnableAutoType).to.equal('null');
                        expect(transformedGroup.EnableSearching).to.equal('null');
                        expect(transformedGroup.LastTopVisibleEntry).to.equal('XGgNkCd2WESeK0KK1K7ahg==');

                        expect(transformedGroup.Times.CreationTime).to.equal('2013-11-11T18:49:01Z');
                        expect(transformedGroup.Times.LastModificationTime).to.equal('2013-11-11T18:49:01Z');
                        expect(transformedGroup.Times.LastAccessTime).to.equal('2015-11-21T19:26:38Z');
                        expect(transformedGroup.Times.ExpiryTime).to.equal('2013-11-11T18:47:58Z');
                        expect(transformedGroup.Times.Expires).to.equal('False');
                        expect(transformedGroup.Times.UsageCount).to.equal('6');
                        expect(transformedGroup.Times.LocationChanged).to.equal('2013-11-11T18:49:01Z');

                        expect(transformedGroup.Entry.UUID).to.equal('XGgNkCd2WESeK0KK1K7ahg==');
                        expect(transformedGroup.Entry.IconID).to.equal('38');
                        expect(transformedGroup.Entry.ForegroundColor).to.equal('');
                        expect(transformedGroup.Entry.BackgroundColor).to.equal('');
                        expect(transformedGroup.Entry.OverrideURL).to.equal('');
                        expect(transformedGroup.Entry.Tags).to.equal('');
                        expect(transformedGroup.Entry.History).to.equal('');

                        expect(transformedGroup.Entry.Times.CreationTime).to.equal('2015-11-21T10:40:57Z');
                        expect(transformedGroup.Entry.Times.LastModificationTime).to.equal('2015-11-21T10:40:59Z');
                        expect(transformedGroup.Entry.Times.LastAccessTime).to.equal('2015-11-21T10:40:59Z');
                        expect(transformedGroup.Entry.Times.ExpiryTime).to.equal('2015-11-21T10:40:17Z');
                        expect(transformedGroup.Entry.Times.Expires).to.equal('False');
                        expect(transformedGroup.Entry.Times.UsageCount).to.equal('1');
                        expect(transformedGroup.Entry.Times.LocationChanged).to.equal('2015-11-21T10:40:57Z');

                        expect(transformedGroup.Entry.AutoType.Enabled).to.equal('True');
                        expect(transformedGroup.Entry.AutoType.DataTransferObfuscation).to.equal('0');

                        expect(transformedGroup.Entry.String.get('UserName')).to.equal('');
                        expect(transformedGroup.Entry.String.get('URL')).to.equal('');
                        expect(transformedGroup.Entry.String.get('Title')).to.equal('test');
                        expect(transformedGroup.Entry.String.get('Notes')).to.equal('');

                        expect(transformedGroup.Entry.String.get('Password')._).not.to.equal('kyFKNwuVRni4pvxhveJm');
                    })
                    .then(done)
                    .catch(done);
        });

        it('transforms an entry', done => {
            sanitizeDb(totp)(testDatabase.KeePassFile.Root.Group)
                    .then(({entriesToGroupId: entriesToGroupId}) => {
                        const transformedEntry = entriesToGroupId.get('n3rnRvvOF0SvPriiFXr+Tg==')[0];
                        expect(transformedEntry.UUID).to.equal('ZAw4YRw+pEic7TYfVOQ9vg==');
                        expect(transformedEntry.IconID).to.equal('0');
                        expect(transformedEntry.ForegroundColor).to.equal('');
                        expect(transformedEntry.BackgroundColor).to.equal('');
                        expect(transformedEntry.OverrideURL).to.equal('');
                        expect(transformedEntry.Tags).to.equal('');
                        expect(transformedEntry.Times.CreationTime).to.equal('2013-11-11T18:49:01Z');
                        expect(transformedEntry.Times.LastModificationTime).to.equal('2013-11-11T18:49:01Z');
                        expect(transformedEntry.Times.LastAccessTime).to.equal('2013-11-11T18:49:01Z');
                        expect(transformedEntry.Times.ExpiryTime).to.equal('2013-11-11T18:47:58Z');
                        expect(transformedEntry.Times.Expires).to.equal('False');
                        expect(transformedEntry.Times.UsageCount).to.equal('0');
                        expect(transformedEntry.Times.LocationChanged).to.equal('2013-11-11T18:49:01Z');
                        expect(transformedEntry.AutoType.Enabled).to.equal('True');
                        expect(transformedEntry.AutoType.DataTransferObfuscation).to.equal('0');
                        expect(transformedEntry.AutoType.Association.Window).to.equal('Target Window');
                        expect(transformedEntry.AutoType.Association.KeystrokeSequence).to.equal(
                                '{USERNAME}{TAB}{PASSWORD}{TAB}{ENTER}');
                        expect(transformedEntry.History).to.equal('');

                        expect(transformedEntry.String.get('UserName')).to.equal('User Name');
                        expect(transformedEntry.String.get('URL')).to.equal('http://keepass.info/');
                        expect(transformedEntry.String.get('Title')).to.equal('Sample Entry');
                        expect(transformedEntry.String.get('Notes')).to.equal('Notes');

                        expect(transformedEntry.String.get('Password')._).not.to.equal('Password');
                    })
                    .then(done)
                    .catch(done);
        });

        it('transforms groups in groups', done => {
            const someGroups = {
                UUID: 'parent',
                Group: [
                    {
                        UUID: 'Child1'
                    }, {
                        UUID: 'Child2'
                    }]
            };

            sanitizeDb(totp)(someGroups)
                    .then(({database: database}) => {
                        expect(database.UUID).to.equal('parent');
                        expect(database.Group[0].UUID).to.equal('Child1');
                        expect(database.Group[1].UUID).to.equal('Child2');
                    })
                    .then(done)
                    .catch(done);
        });

        it('transforms the complete database', done => {
            sanitizeDb(totp)(testDatabase)
                    .then(({database: database, entriesToGroupId: entriesToGroupId}) => {
                        const mainGroup = database.Root.Group;

                        expect(mainGroup.Entry[0].UUID).to.equal('ZAw4YRw+pEic7TYfVOQ9vg==');
                        expect(mainGroup.Entry[1].UUID).to.equal('245S+MhtfUaOzVPUwv4KMQ==');
                        expect(mainGroup.Group[0].UUID).to.equal('wXlnHFx+T0mHRYtNN+WgJg==');
                        expect(mainGroup.Group[1].UUID).to.equal('PtfRMFDAvkeQBJ/VTfhJ2Q==');
                        expect(mainGroup.Group[1].Entry.UUID).to.equal('XGgNkCd2WESeK0KK1K7ahg==');
                        expect(mainGroup.Group[1].Group.UUID).to.equal('VGxv5yLT60mvcB1baVo56w==');

                        expect(entriesToGroupId.size).to.equal(3);
                    })
                    .then(done)
                    .catch(done);

        });

        it('gets all the entries', done => {
            sanitizeDb(totp)(testDatabase)
                    .then(({database: database, entriesToGroupId: entriesToGroupId}) => {
                        const g1 = entriesToGroupId.get('n3rnRvvOF0SvPriiFXr+Tg==');
                        expect(g1).to.exist;
                        expect(g1.length).to.equal(2);
                        expect(g1[0].UUID).to.equal('ZAw4YRw+pEic7TYfVOQ9vg==');
                        expect(g1[1].UUID).to.equal('245S+MhtfUaOzVPUwv4KMQ==');

                        const g2 = entriesToGroupId.get('PtfRMFDAvkeQBJ/VTfhJ2Q==');
                        expect(g2).to.exist;
                        expect(g2.length).to.equal(1);
                        expect(g2[0].UUID).to.equal('XGgNkCd2WESeK0KK1K7ahg==');

                        const g3 = entriesToGroupId.get('VGxv5yLT60mvcB1baVo56w==');
                        expect(g3).to.exist;
                        expect(g3.length).to.equal(1);
                        expect(g3[0].UUID).to.equal('kGrsiQCqAkeTpaguAP8s4Q==');

                        expect(entriesToGroupId.size).to.equal(3);
                    })
                    .then(done)
                    .catch(done);
        });

        it('gets all the entries - TWICE', done => {
            sanitizeDb(totp)(testDatabase)
                    .then(({database: database, entriesToGroupId: entriesToGroupId}) => {
                        const g1 = entriesToGroupId.get('n3rnRvvOF0SvPriiFXr+Tg==');
                        expect(g1).to.exist;
                        expect(g1.length).to.equal(2);
                        expect(g1[0].UUID).to.equal('ZAw4YRw+pEic7TYfVOQ9vg==');
                        expect(g1[1].UUID).to.equal('245S+MhtfUaOzVPUwv4KMQ==');

                        const g2 = entriesToGroupId.get('PtfRMFDAvkeQBJ/VTfhJ2Q==');
                        expect(g2).to.exist;
                        expect(g2.length).to.equal(1);
                        expect(g2[0].UUID).to.equal('XGgNkCd2WESeK0KK1K7ahg==');

                        const g3 = entriesToGroupId.get('VGxv5yLT60mvcB1baVo56w==');
                        expect(g3).to.exist;
                        expect(g3.length).to.equal(1);
                        expect(g3[0].UUID).to.equal('kGrsiQCqAkeTpaguAP8s4Q==');

                        expect(entriesToGroupId.size).to.equal(3);
                    })
                    .then(done)
                    .catch(done);
        });

        it('finds entries by strings-value', () => {
            let getMatch = matches('aValue01', totp)(testDatabase);

            expect(getMatch[0].UUID).to.equal('kGrsiQCqAkeTpaguAP8s4Q==');
            expect(getMatch.length).to.deep.equal(1);
        });

        it('finds entries by strings-key', () => {
            totp = new TOTP('IFAUCQKCIJBEE===', 12, 777);
            let getMatch = matches('aField01', totp)(testDatabase);

            expect(getMatch[0].UUID).to.equal('kGrsiQCqAkeTpaguAP8s4Q==');
            expect(getMatch.length).to.deep.equal(1);
        });

        it('finds entries by substring of strings-value', () => {
            let getMatch = matches('aVa', totp)(testDatabase);

            expect(getMatch[0].UUID).to.equal('kGrsiQCqAkeTpaguAP8s4Q==');
            expect(getMatch.length).to.deep.equal(1);
        });

        it('finds entries by substring of strings-key', () => {
            let getMatch = matches('aFi', totp)(testDatabase);

            expect(getMatch[0].UUID).to.equal('kGrsiQCqAkeTpaguAP8s4Q==');
            expect(getMatch.length).to.deep.equal(1);
        });

        it('finds entries by regexp of strings-value', () => {
            let getMatch = matches('a.*01', totp)(testDatabase);

            expect(getMatch[0].UUID).to.equal('kGrsiQCqAkeTpaguAP8s4Q==');
            expect(getMatch.length).to.deep.equal(1);
        });

        it('finds entries by regexp of strings-key', () => {
            let getMatch = matches('a.*01', totp)(testDatabase);

            expect(getMatch[0].UUID).to.equal('kGrsiQCqAkeTpaguAP8s4Q==');
            expect(getMatch.length).to.deep.equal(1);
        });

        it('finds entries by regexp of tags', () => {
            let getMatch = matches('t.*g2', totp)(testDatabase);

            expect(getMatch[0].UUID).to.equal('kGrsiQCqAkeTpaguAP8s4Q==');
            expect(getMatch.length).to.deep.equal(1);
        });

        describe('handles protected strings', () => {
            it('like getting a password', done => {
                getString('XGgNkCd2WESeK0KK1K7ahg==', 'Password', totp)(testDatabase)
                        .then(password => {
                            expect(password).to.equal('kyFKNwuVRni4pvxhveJm');
                        })
                        .then(done)
                        .catch(done);
            });

            it('like getting a password', done => {
                getString('XGgNkCd2WESeK0KK1K7ahg==', 'Password', totp)(testDatabase)
                        .then(password => {
                            expect(password).to.equal('kyFKNwuVRni4pvxhveJm');
                        })
                        .then(done)
                        .catch(done);
            });

            it('decryption impossible after the totp time out', done => {
                log.debug('Let time almost run out');
                clock.tick(2999);

                log.debug('Trying to access the protected entry after timeout');
                getString('XGgNkCd2WESeK0KK1K7ahg==', 'Password', totp)(testDatabase)
                        .then(password=> {
                            log.debug('Evaluating first call - should yet be successful');
                            expect(password).to.equal('kyFKNwuVRni4pvxhveJm');
                        })
                        .then(() => {
                            log.debug('Let the time run out');
                            clock.tick(1);
                        })
                        .then(() => {
                            return getString('XGgNkCd2WESeK0KK1K7ahg==', 'Password', totp)(testDatabase);
                        })
                        .then(() => done('Expected an exception'))
                        .catch(error => {
                            expect(error.message).to.equal(
                                    'error:06065064:digital envelope routines:EVP_DecryptFinal_ex:bad decrypt');
                            done();
                        }).catch(done);
            });

        });
    });

})();