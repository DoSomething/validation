import { describe, it } from 'mocha';
import assert from 'power-assert';
import isPromise from 'is-promise';

import Validator from '../src/Validator';

describe('Validator', () => {

  /**
   * @tests Validator.listRules(), Validator.hasRule(), Validator.addRule()
   */
  it('can list, query, and add rules', () => {
    // Make a fresh Validator for testing state
    let validator = new Validator();

    assert(validator.listRules().length === 0, 'should not have any rules to start');
    assert(validator.hasRule('dog') === false, 'should return false when asking for a nonexistent rule');

    // Register a simple validator
    validator.addRule('yes', (name, value, resolve) => resolve(true));

    assert(validator.hasRule('yes') === true, 'should return true when asking for an existing rule');

    assert.throws(() => {
      validator.addRule('yes', () => true);
    }, `A validation function called 'yes' has already been registered.`, 'should throw if redefining a rule');
  });

  /**
   * @tests Validator.parseRule()
   */
  it('can parse rules', () => {
    let validator = new Validator();

    assert.deepEqual(validator.parseRules('required|unique'),
      [ { name: 'required', param: [] }, { name: 'unique', param: [] } ],
      'correctly parses rules with arguments'
    );

    assert.deepEqual(validator.parseRules('min:5|max:2'),
      [ { name: 'min', param: [5] }, { name: 'max', param: [2] } ],
      'correctly parses rules with arguments'
    );
  });

  /**
   * @tests Validator.getPromise()
   */
  it('can create a passing validator promise', () => {
    let validator = new Validator();
    validator.addRule('yes', (name, value, resolve) => resolve(true));
    validator.addRule('no', (name, value, resolve) => resolve(false));

    assert.throws(() => validator.getPromise('test', 'dog'), `Validation rule 'dog' does not exist.`);

    return validator.getPromise('test', 'yes').then((result) => {
      assert(result === true, 'getPromise with \'yes\' validator returns true');
    });
  });


  /**
   * @tests Validator.getPromise()
   */
  it('can create a failing validator promise', () => {
    let validator = new Validator();
    validator.addRule('yes', (name, value, resolve) => resolve(true));
    validator.addRule('no', (name, value, resolve) => resolve(false));

    return validator.getPromise('test', 'no').then(function (result) {
      assert(result === false, 'getPromise with \'no\' validator returns false');
    });
  });

  /**
   * @tests Validator.validate()
   */
  it('can validate a field with a passing rule', () => {
    let validator = new Validator();
    validator.addRule('yes', (name, value, resolve) => resolve(true));
    validator.addRule('no', (name, value, resolve) => resolve(false));

    var validatesYes = validator.validate('test', 'yes');
    assert(isPromise(validatesYes) === true, 'validate returns a promise for all validations');

    return validatesYes.then(function (result) {
      assert(result === true, 'validates a field with a passing rule');
    });
  });

  /**
   * @tests Validator.validate()
   */
  it('can validate a field with a failing rule', () => {
    let validator = new Validator();
    validator.addRule('yes', (name, value, resolve) => resolve(true));
    validator.addRule('no', (name, value, resolve) => resolve(false));

    return validator.validate('test', 'no').then(function (result) {
      assert(result === false, 'invalidates a field with a failing rule');
    });
  });

  /**
   * @tests Validator.validate()
   * @param {Test} t - Tester
   */
  it('can validate a field with a passing & failing rule', () => {
    let validator = new Validator();
    validator.addRule('yes', (name, value, resolve) => resolve(true));
    validator.addRule('no', (name, value, resolve) => resolve(false));

    return validator.validate('test', 'yes|no').then(function(result) {
      assert(result === false, 'invalidates a field with a passing and failing rule');
    });
  });

  /**
   * @tests Validator.validateAll()
   * @param {Test} t - Tester
   */
  it('can validate a form ignoring blank fields', () => {
    let validator = new Validator();
    validator.addRule('yes', (name, value, resolve) => resolve(true));
    validator.addRule('no', (name, value, resolve) => resolve(false));

    let form = {
      name: {
        rules: 'yes',
        value: 'David',
      },
      email: {
        rules: 'no',
        value: '', // <-- blank field
      },
      birthdate: {
        rules: 'yes',
        value: '10/25/1990',
      },
      ignoredField: {
        // rules: nada
        value: 'lorem ipsum'
      }
    };

    // Validate form, ignoring blank fields.
    return validator.validateAll(form, false).then(function (result) {
      assert.deepEqual(result, {name: true, birthdate: true}, 'should correctly ignoring blank failing field when instructed');
    });
  });

  /**
   * @tests Validator.validateAll()
   * @param {Test} t - Tester
   */
  it('can validate a form with blank fields', () => {
    let validator = new Validator();
    validator.addRule('yes', (name, value, resolve) => resolve(true));
    validator.addRule('no', (name, value, resolve) => resolve(false));

    let form = {
      name: {
        rules: 'yes',
        value: 'David',
      },
      email: {
        rules: 'no',
        value: '', // <-- blank field
      },
      birthdate: {
        rules: 'yes',
        value: '10/25/1990',
      },
      ignoredField: {
        // rules: nada
        value: 'lorem ipsum'
      }
    };

    // Validate form, *not* ignoring blank fields.
    return validator.validateAll(form, true).then(function(result) {
      assert.deepEqual(result, { name: true, email: false, birthdate: true }, 'should correctly validate when counting blank failing field');
    });
  });

});
