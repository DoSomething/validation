import alpha_num from '../../src/rules/alpha_num';

const assert = require('power-assert');

describe('rules/alpha_num', () => {
  it('validates string of alphabetic characters', () => {
    alpha_num('abcd', null, result => assert(result == true));
  });

  it('accepts string with numbers', () => {
    alpha_num('123', null, result => assert(result == true));
    alpha_num('abc123', null, result => assert(result == true));
  });

  it('rejects string with special characters', () => {
    alpha_num('http://google.com', null, (result, message) => {
      assert(result == false);
      assert(message == `The :attribute must contain only alphanumeric characters.`);
    });
  });

  it('rejects string with new-line characters', () => {
    alpha_num(`a string with
        a line break`, null, result => assert(result == false));
  });

  it('rejects string with symbol', () => {
    alpha_num('❤', null, result => assert(result == false));
  });
});

