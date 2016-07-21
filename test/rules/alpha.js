import alpha from '../../src/rules/alpha';

const assert = require('power-assert');

describe('rules/alpha', () => {
  it('validates string of alphabetic characters', () => {
    alpha('abcd', null, result => assert(result == true));
  });

  it('rejects string with special characters', () => {
    alpha('http://google.com', null, (result, message) => {
      assert(result == false);
      assert(message == `The :attribute must contain only alphabetic characters.`);
    });
  });

  it('rejects string with new-line characters', () => {
    alpha(`a string with
        a line break`, null, result => assert(result == false));
  });

  it('rejects string with symbol', () => {
    alpha('❤', null, result => assert(result == false));
  });

  it('rejects string with numbers', () => {
    alpha('123', null, result => assert(result == false));
    alpha('abc123', null, result => assert(result == false));
  });
});

