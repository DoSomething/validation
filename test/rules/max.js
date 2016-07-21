import max from '../../src/rules/max';

const assert = require('power-assert');

describe('rules/max', () => {
  it('validates string with length below max', () => {
    max('hi', [3], result => assert(result == true));
  });

  it('validates string with length equal to max', () => {
    max('foo', [3], result => assert(result == true));
  });

  it('rejects string with length above min', () => {
    max('foobar', [3], (result, message) => {
      assert(result == false);
      assert(message == 'The :attribute must be 3 or less.');
    });
  });

  it('validates number below max', () => {
    max('2', [3], result => assert(result == true));
  });

  it('validates number equal to max', () => {
    max('3', [3], result => assert(result == true));
  });

  it('rejects number greater than max', () => {
    max('5', [3], (result, message) => {
      assert(result == false)
      assert(message == 'The :attribute must be 3 or less.');
    });
  });
});

