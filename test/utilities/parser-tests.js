import { parseString, parseParameter } from '../../src/utilities/parsers';

const assert = require('power-assert');

describe('parsers: parseString', () => {
  it('can parse strings', () => {
    assert(parseString('4') === 4, 'can parse a positive integer');
  });

  // ...
});

describe('parsers: parseParameter', () => {
  it('can parse strings', () => {
    assert(parseParameter('string') === 'string', 'can parse a string parameter');
  });

  // ...
});
