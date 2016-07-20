import LaravelValidator from '../../src/validators/LaravelValidator';

const { describe, it } = require('mocha');
const assert = require('power-assert');

describe('LaravelValidator', () => {

  /**
   * @tests Validator.validateAll()
   * @param t - Tester
   */
  it('can validate a sample form', () => {
    let validator = new LaravelValidator();

    // Form data for Validator.validateAll() tests
    let form = [
      {
        name: 'age',
        rules: 'max:22|min:18',
        value: '21',
      },
      {
        name: 'animal',
        rules: 'min:4',
        value: 'dog',
      },
      {
        name: 'good_string',
        rules: 'min:4',
        value: 'hello',
      },
      {
        name: 'quantity',
        rules: 'min:4',
        value: '1',
      },
    ];

    // Validate form, ignoring blank fields.
    return validator.validateAll(form, false).then(function (result) {
      assert.deepEqual(result, [
        {
          name: 'age',
          success: true,
          message: '',
        },
        {
          name: 'animal',
          success: false,
          message: 'The animal must be 4 or greater.',
        },
        {
          name: 'good_string',
          success: true,
          message: '',
        },
        {
          name: 'quantity',
          success: false,
          message: 'The quantity must be 4 or greater.',
        },
      ], 'should validate sample data correctly');
    });
  });

});
