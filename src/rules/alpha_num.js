/**
 * The field under validation must contain only alphanumeric characters.
 *
 * @param {String} value
 * @param {Array} params
 * @param validate
 */
export default function alpha_num(value, params, validate) {
  const pattern = /^[a-z0-9]+$/i;

  if (! pattern.test(value)) {
    return validate(false, `The :attribute must contain only alphanumeric characters.`)
  }

  validate(true);
}
