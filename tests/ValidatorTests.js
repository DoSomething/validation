import test from 'ava';
import isPromise from 'is-promise';
import 'babel-core/register';

import Validator from '../src/Validator';

test.beforeEach(t => {
  t.context.validator = new Validator();

  // Simple passing and failing validator functions
  t.context.validator.addRule('yes', (name, value, resolve) => resolve(true));
  t.context.validator.addRule('no', (name, value, resolve) => resolve(false));

  // Form data for Validator.validateAll() tests
  t.context.form = {
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
});

/**
 * @tests Validator.listRules(), Validator.hasRule(), Validator.addRule()
 * @param {Test} t - Tester
 */
test('can list, query, and add rules', t => {
  // Make a fresh Validator for testing state
  let validator = new Validator();

  t.is(validator.listRules().length, 0, 'should not have any rules to start');
  t.false(validator.hasRule('dog'), 'should return false when asking for a nonexistent rule');

  // Register a simple validator
  validator.addRule('yes', (name, value, resolve) => resolve(true));

  t.true(validator.hasRule('yes'), 'should return true when asking for an existing rule');

  t.throws(function () {
    validator.addRule('yes', () => true);
  }, `A validation function called 'yes' has already been registered.`, 'should throw if redefining a rule');
});


/**
 * @tests Validator.parseRule()
 * @param {Test} t - Tester
 */
test('can parse rules', t => {
  let validator = new Validator();

  t.same(validator.parseRules('required|unique'),
    [ { name: 'required', param: [] }, { name: 'unique', param: [] } ],
    'correctly parses rules with arguments'
  );

  t.same(validator.parseRules('min:5|max:2'),
    [ { name: 'min', param: '5' }, { name: 'max', param: '2' } ],
    'correctly parses rules with arguments'
  );
});

/**
 * @tests Validator.getPromise()
 * @param {Test} t - Tester
 */
test('can create a passing validator promise', t => {
  let { validator } = t.context;

  t.throws(() => {
      validator.getPromise('test', 'dog')
    }, `Validation rule 'dog' does not exist.`,
    'throws on trying to promisify non-existent validator'
  );

  return validator.getPromise('test', 'yes').then((result) => {
    t.true(result, 'getPromise with \'yes\' validator returns true');
  });
});


/**
 * @tests Validator.getPromise()
 * @param {Test} t - Tester
 */
test('can create a failing validator promise', t => {
  let { validator } = t.context;

  return validator.getPromise('test', 'no').then(function (result) {
    t.false(result, 'getPromise with \'no\' validator returns false');
  });
});

/**
 * @tests Validator.validate()
 * @param {Test} t - Tester
 */
test('can validate a field with a passing rule', t => {
  let { validator } = t.context;

  var validatesYes = validator.validate('test', 'yes');
  t.true(isPromise(validatesYes), 'validate returns a promise for all validations');

  return validatesYes.then(function (result) {
    t.true(result, 'validates a field with a passing rule');
  });
});

/**
 * @tests Validator.validate()
 * @param {Test} t - Tester
 */
test('can validate a field with a failing rule', t => {
  let { validator } = t.context;

  return validator.validate('test', 'no').then(function (result) {
    t.false(result, 'invalidates a field with a failing rule');
  }).catch(function(err) {
    console.log(err);
  });
});

/**
 * @tests Validator.validate()
 * @param {Test} t - Tester
 */
test('can validate a field with a passing & failing rule', t => {
  let { validator } = t.context;

  return validator.validate('test', 'yes|no').then(function(result) {
    t.false(result, 'invalidates a field with a passing and failing rule');
  });
});

/**
 * @tests Validator.validateAll()
 * @param {Test} t - Tester
 */
test('can validate a form ignoring blank fields', t => {
  let { validator, form } = t.context;

  // Validate form, ignoring blank fields.
  return validator.validateAll(form, false).then(function (result) {
    t.same(result, {name: true, birthdate: true}, 'should correctly ignoring blank failing field when instructed');
  });
});

/**
 * @tests Validator.validateAll()
 * @param {Test} t - Tester
 */
test('can validate a form with blank fields', t => {
  let { validator, form } = t.context;
  t.plan(1);

  // Validate form, *not* ignoring blank fields.
  return validator.validateAll(form, true).then(function(result) {
    t.same(result, { name: true, email: false, birthdate: true }, 'should correctly validate when counting blank failing field');
  });
});
