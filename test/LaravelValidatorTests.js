import { describe, it } from 'mocha';
import assert from 'power-assert';

import LaravelValidator from '../src/validators/LaravelValidator';

describe('LaravelValidator', () => {

  /**
   * @tests Validator.validateAll()
   * @param t - Tester
   */
  it('can validate a sample form', () => {
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
      goodString: {
        rules: 'min:4',
        value: 'hello',
      },
      badString: {
        rules: 'min:4',
        value: 'dog',
      },
    };

    // Validate form, ignoring blank fields.
    return validator.validateAll(form, false).then(function (result) {
      assert.deepEqual(result, {
        age: true,
        quantity: false,
        goodString: true,
        badString: false,
      }, 'should validate sample data correctly');
    });
  });

});
