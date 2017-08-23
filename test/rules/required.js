import required from '../../src/rules/required';

const assert = require('power-assert');

describe('rules/required', () => {
  it('validates a non-blank string', () => {
    required('abcd', null, result => assert(result == true));
  });

  it('rejects a blank string', () => {
    required('', null, result => assert(result == false));
  });
});

