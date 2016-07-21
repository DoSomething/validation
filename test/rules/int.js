import int from '../../src/rules/int';

const assert = require('power-assert');

describe('rules/int', () => {

  it('validates numeric string', () => {
    int('1982', null, result => assert(result == true));
  });

  it('validates numeric string with extra whitespace', () => {
    int('   1982   ', null, result => assert(result == true));
  });

  it('validates negative numeric string', () => {
    int('-1982', null, result => assert(result == true));
  });

  it('rejects float string', () => {
    int('1982.08', null, result => assert(result == false));
  });

  it('rejects negative float string', () => {
    int('-1982.08', null, result => assert(result == false));
  });

  it('rejects alphanumeric string', () => {
    int('r3j3ct3d', null, result => assert(result == false));
  });

  it('rejects alpha string', () => {
    int('goodbye', null, result => assert(result == false));
  });

});
