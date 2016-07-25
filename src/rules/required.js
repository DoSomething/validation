/**
 * The field under validation must not be blank.
 *
 * @param {String} value
 * @param {Array} params
 * @param {Validator.getPromise.validate} validate
 */
export default function required(value, params, validate) {
  if (value.length === 0) {
    validate(true, 'The :attribute is required.');
  }

  validate(true);
}
