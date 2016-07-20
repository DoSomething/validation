import { parseString, parseParameter } from '../../src/utilities/parsers';

const assert = require('power-assert');

describe('utilities/parsers', () => {
  describe('parseString', () => {
    it('can parse numeric strings into numbers', () => {
      assert(parseString('4') === 4);
      assert(parseString('2.3') === 2.3);
      assert(parseString(' 1.75') === 1.75);
      assert(parseString('-1') === -1);
    });

    it('can parse non-numeric string length', () => {
      assert(parseString('') === 0);
      assert(parseString('dog') === 3);
      assert(parseString(' spaced out') === 11);
    });
  });

  describe('parseParameter', () => {
    it('can parse strings', () => {
      assert(parseParameter('string') === 'string');
      assert(parseParameter('') === '');
    });

    it('can parse booleans', () => {
      assert(parseParameter('true') === true);
      assert(parseParameter('TRUE') === true);
      assert(parseParameter('true ') === true);

      assert(parseParameter('false') === false);
      assert(parseParameter('FALSE') === false);
      assert(parseParameter('false ') === false);
    });

    it('can parse numbers', () => {
      assert(parseParameter('01') === 1);
      assert(parseParameter('2 ') === 2);
      assert(parseParameter('3.4') === 3.4);
    });
  });
});
