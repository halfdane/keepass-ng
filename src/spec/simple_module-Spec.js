import SimpleModule from './simple_module.js';
describe('module access', () => {
    it('should exist', () => {
        expect(SimpleModule).to.exist;
    });

    it('should be instantiated', () => {
        var simpleModule = new SimpleModule();
        expect(simpleModule).to.exist;
    });
});