/**
 * The field under validation must be a valid integer.
 *
 * @param  {String} value
 * @param  {Array} params
 * @param  {Validator.getPromise.validate} validate
 * @return {Validator.getPromise.validate} validate
 */
export default function int(value, params, validate) {
  let number = Number(value.trim());

  if (! Number.isInteger(number)) {
    return validate(false, 'The :attribute must be a valid integer.');
  }

  validate(true);
}
