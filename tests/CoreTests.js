import test from 'ava';
import isPromise from 'is-promise';
import 'babel-core/register';

import Core from '../src/core';

test.beforeEach(t => {
  t.context.core = new Core();

  // Simple passing and failing validator functions
  t.context.core.registerValidator('yes', (name, value, resolve) => resolve(true));
  t.context.core.registerValidator('no', (name, value, resolve) => resolve(false));

  // Form data for Core.validateAll() tests
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
 * @tests Core.listValidators(), Core.hasValidator(), Core.registerValidator()
 * @param {Test} t - Tester
 */
test('can list, query, and add validators', t => {
  // Make a fresh Core for testing state
  let core = new Core();

  t.is(core.listValidators().length, 0, 'should not have any validators to start');
  t.false(core.hasValidator('dog'), 'should return false when asking for a nonexistent validator');

  // Register a simple validator
  core.registerValidator('yes', (name, value, resolve) => resolve(true));

  t.true(core.hasValidator('yes'), 'should return true when asking for an existing validator');

  t.throws(function () {
    core.registerValidator('yes', () => true);
  }, `A validation function called 'yes' has already been registered.`, 'should throw if redefining a validator');
});


/**
 * @tests Core.parseRule()
 * @param {Test} t - Tester
 */
test('can parse rules', t => {
  let core = new Core();

  t.same(core.parseRules('required|unique'),
    [ { name: 'required', param: [] }, { name: 'unique', param: [] } ],
    'correctly parses rules with arguments'
  );

  t.same(core.parseRules('min:5|max:2'),
    [ { name: 'min', param: '5' }, { name: 'max', param: '2' } ],
    'correctly parses rules with arguments'
  );
});

/**
 * @tests Core.getPromise()
 * @param {Test} t - Tester
 */
test('can create a passing validator promise', t => {
  let { core } = t.context;

  t.throws(() => {
      core.getPromise('test', 'dog')
    }, `Validation rule 'dog' does not exist.`,
    'throws on trying to promisify non-existent validator'
  );

  return core.getPromise('test', 'yes').then((result) => {
    t.true(result, 'getPromise with \'yes\' validator returns true');
  });
});


/**
 * @tests Core.getPromise()
 * @param {Test} t - Tester
 */
test('can create a failing validator promise', t => {
  let { core } = t.context;

  return core.getPromise('test', 'no').then(function (result) {
    t.false(result, 'getPromise with \'no\' validator returns false');
  });
});

/**
 * @tests Core.validate()
 * @param {Test} t - Tester
 */
test('can validate a field with a passing rule', t => {
  let { core } = t.context;

  var validatesYes = core.validate('test', 'yes');
  t.true(isPromise(validatesYes), 'validate returns a promise for all validations');

  return validatesYes.then(function (result) {
    t.true(result, 'validates a field with a passing rule');
  });
});

/**
 * @tests Core.validate()
 * @param {Test} t - Tester
 */
test('can validate a field with a failing rule', t => {
  let { core } = t.context;

  return core.validate('test', 'no').then(function (result) {
    t.false(result, 'invalidates a field with a failing rule');
  }).catch(function(err) {
    console.log(err);
  });
});

/**
 * @tests Core.validate()
 * @param {Test} t - Tester
 */
test('can validate a field with a passing & failing rule', t => {
  let { core } = t.context;

  return core.validate('test', 'yes|no').then(function(result) {
    t.false(result, 'invalidates a field with a passing and failing rule');
  });
});

/**
 * @tests Core.validateAll()
 * @param {Test} t - Tester
 */
test('can validate a form ignoring blank fields', t => {
  let { core, form } = t.context;

  // Validate form, ignoring blank fields.
  return core.validateAll(form, false).then(function (result) {
    t.same(result, {name: true, birthdate: true}, 'should correctly ignoring blank failing field when instructed');
  });
});

/**
 * @tests Core.validateAll()
 * @param {Test} t - Tester
 */
test('can validate a form with blank fields', t => {
  let { core, form } = t.context;
  t.plan(1);

  // Validate form, *not* ignoring blank fields.
  return core.validateAll(form, true).then(function(result) {
    t.same(result, { name: true, email: false, birthdate: true }, 'should correctly validate when counting blank failing field');
  });
});
