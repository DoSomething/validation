import alpha_dash from '../../src/rules/alpha_dash';

const assert = require('power-assert');

describe('rules/alpha_dash', () => {
  it('validates plain alphanumeric string', () => {
    alpha_dash('abc123', null, result => assert(result == true));
  });

  it('validates string with just dashes', () => {
    alpha_dash('---', null, result => assert(result == true));
  });

  it('validates strings with letters, numbers, and dashes', () => {
    alpha_dash('a-bc_123', null, result => assert(result == true));
  });

  it('rejects string with other special characters', () => {
    alpha_dash('http://google.com', null, (result, message) => {
      assert(result == false);
      assert(message == `The :attribute must contain only alphanumeric characters, dashes, or underscores.`);
    });
  });

  it('rejects string with new-line characters', () => {
    alpha_dash(`a string with
        a line break`, null, result => assert(result == false));
  });

  it('rejects string with symbol', () => {
    alpha_dash('❤', null, result => assert(result == false));
  });
});

