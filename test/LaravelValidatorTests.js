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
        rules: 'max:22|min:18',
        value: '21',
      },
      animal: {
        rules: 'min:4',
        value: 'dog',
      },
      goodString: {
        rules: 'min:4',
        value: 'hello',
      },
      quantity: {
        rules: 'min:4',
        value: '1',
      },
    };

    // Validate form, ignoring blank fields.
    return validator.validateAll(form, false).then(function (result) {
      assert.deepEqual(result, {
        age: {
          success: true,
          message: '',
        },
        animal: {
          success: false,
          message: 'The animal must be 4 or greater.',
        },
        goodString: {
          success: true,
          message: '',
        },
        quantity: {
          success: false,
          message: 'The quantity must be 4 or greater.',
        },
      }, 'should validate sample data correctly');
    });
  });

});
