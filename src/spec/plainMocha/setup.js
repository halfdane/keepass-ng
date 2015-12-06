var chai = require('chai');

chai.config.includeStack = true;

global.expect = chai.expect;
global.AssertionError = chai.AssertionError;
global.Assertion = chai.Assertion;
global.assert = chai.assert;

require('chai')
        .use(require('chai-as-promised'))
        .use(require('sinon-chai'));

import 'babel-polyfill';

global.sinon = require('sinon');