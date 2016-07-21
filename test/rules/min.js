import min from '../../src/rules/min';

const assert = require('power-assert');

describe('rules/min', () => {
  it('rejects string with length below min', () => {
    min('hi', [3], (result, message) => {
      assert(result == false);
      assert(message == 'The :attribute must be 3 or greater.');
    });
  });

  it('validates string with length equal to min', () => {
    min('foo', [3], result => assert(result == true));
  });

  it('validates string with length above min', () => {
    min('foobar', [3], result => assert(result == true));
  });

  it('rejects number below min', () => {
    min('2', [3], (result, message) => {
      assert(result == false);
      assert(message == 'The :attribute must be 3 or greater.');
    });
  });

  it('validates number equal to min', () => {
    min('3', [3], result => assert(result == true));
  });

  it('validates number greater than min', () => {
    min('5', [3], result => assert(result == true));
  });
});

