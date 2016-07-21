/**
 * The field under validation must contain only alphanumeric characters,
 * dashes, and underscores.
 *
 * @param {String} value
 * @param {Array} params
 * @param {Validator.getPromise.validate} validate
 */
export default function alpha_dash(value, params, validate) {
  const pattern = /^[a-z0-9\-_]+$/i;

  if (! pattern.test(value)) {
    return validate(false, `The :attribute must contain only alphanumeric characters, dashes, or underscores.`)
  }

  validate(true);
}
