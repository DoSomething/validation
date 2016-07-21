/**
 * The field under validation must contain only alphabetic characters.
 *
 * @param {String} value
 * @param {Array} params
 * @param validate
 */
export default function alpha(value, params, validate) {
  const pattern = /^[a-z]+$/i;

  if (! pattern.test(value)) {
    return validate(false, `The :attribute must contain only alphabetic characters.`)
  }

  validate(true);
}
