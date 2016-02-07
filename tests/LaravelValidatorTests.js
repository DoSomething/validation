import test from 'ava';
import 'babel-core/register';

import LaravelValidator from '../src/validators/LaravelValidator';

/**
 * @tests Validator.validateAll()
 * @param t - Tester
 */
test('can validate a sample form', t => {
  let validator = new LaravelValidator();

  // Form data for Validator.validateAll() tests
  let form = {
    age: {
      rules: 'min:18',
      value: '21',
    },
    quantity: {
      rules: 'min:4',
      value: '1',
    },
  };

  // Validate form, ignoring blank fields.
  return validator.validateAll(form, false).then(function (result) {
    t.same(result, {age: true, quantity: false}, 'should validate sample data correctly');
  });
});

