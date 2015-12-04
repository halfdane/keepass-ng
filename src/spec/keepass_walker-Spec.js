import KeepassWalker from '../browser/keepass_walker';
import { sanitizeDb } from '../browser/keepass_walker';

describe('KeepassTransformer', ()=> {

    let testDatabase;
    beforeEach(() => {
        testDatabase = require('./fixtures/exampledb.json');
    });

    it('transforms single group without entries or subgroups', () => {
        const transformer = new KeepassWalker(testDatabase.KeePassFile.Root.Group.Group[0]);
        const transformedGroup = transformer.database;

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
    });

    it('transforms array of groups', () => {
        const transformer = new KeepassWalker(testDatabase.KeePassFile.Root.Group.Group);
        const transformedArray = transformer.database;

        const transformedGroup = transformedArray[1];
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

        expect(transformedGroup.Entry.String.get('Password')).not.to.exist;
    });

    it('transforms an entry', () => {
        const transformer = new KeepassWalker(testDatabase.KeePassFile.Root.Group);
        const transformedEntry = transformer.entriesInGroup.get('n3rnRvvOF0SvPriiFXr+Tg==')[0];

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
        expect(transformedEntry.AutoType.Association.KeystrokeSequence).to.equal('{USERNAME}{TAB}{PASSWORD}{TAB}{ENTER}');
        expect(transformedEntry.History).to.equal('');

        expect(transformedEntry.String.get('UserName')).to.equal('User Name');
        expect(transformedEntry.String.get('URL')).to.equal('http://keepass.info/');
        expect(transformedEntry.String.get('Title')).to.equal('Sample Entry');
        expect(transformedEntry.String.get('Notes')).to.equal('Notes');

        expect(transformedEntry.String.get('Password')).not.to.exist;
    });

    it('transforms groups in groups', () => {
        const transformer = new KeepassWalker({
            UUID: 'parent',
            Group: [
                {
                    UUID: 'Child1'
                }, {
                    UUID: 'Child2'
                }]
        });

        const transformedGroup = transformer.database;

        expect(transformedGroup.UUID).to.equal('parent');
        expect(transformedGroup.Group[0].UUID).to.equal('Child1');
        expect(transformedGroup.Group[1].UUID).to.equal('Child2');
    });

    it('transforms the complete database', () => {
        const transformer = new KeepassWalker(testDatabase);
        const mainGroup = transformer.database.KeePassFile.Root.Group;

        expect(mainGroup.Entry[0].UUID).to.equal('ZAw4YRw+pEic7TYfVOQ9vg==');
        expect(mainGroup.Entry[1].UUID).to.equal('245S+MhtfUaOzVPUwv4KMQ==');
        expect(mainGroup.Group[0].UUID).to.equal('wXlnHFx+T0mHRYtNN+WgJg==');
        expect(mainGroup.Group[1].UUID).to.equal('PtfRMFDAvkeQBJ/VTfhJ2Q==');
        expect(mainGroup.Group[1].Entry.UUID).to.equal('XGgNkCd2WESeK0KK1K7ahg==');
        expect(mainGroup.Group[1].Group.UUID).to.equal('VGxv5yLT60mvcB1baVo56w==');
    });

    describe('the iterative walker', () => {
        it('gets all the entries', done => {
            sanitizeDb(testDatabase)
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
            sanitizeDb(testDatabase)
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

    });
});
