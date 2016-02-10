import { parseString } from '../utilities/parsers';

/**
 * The field under validation must have a maximum value.
 *
 * @param {String} value
 * @param {Array} params
 * @param validate
 */
function max(value, params, validate) {
  let number = parseString(value);
  let bound = params[0];

  if (number >= bound) {
    validate(false, `The :attribute must be ${bound} or less.`)
  }

  validate(true);
}

export default max;
