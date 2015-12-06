import remember from '../../browser/native/settings';
global.remember = remember;

var chai = require('chai')
        .use(require('chai-as-promised'))
        .use(require('sinon-chai'));
chai.config.includeStack = true;
global.expect = chai.expect;
global.AssertionError = chai.AssertionError;
global.Assertion = chai.Assertion;

global.assert = chai.assert;
global.sinon = require('sinon');

