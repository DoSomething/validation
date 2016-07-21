import { parseString } from '../utilities/parsers';

/**
 * The field under validation must have a minimum value. For string data,
 * value corresponds to the number of characters. For numeric data, value
 * corresponds to a given integer value.
 *
 * @param {String} value
 * @param {Array} params
 * @param validate
 */
export default function min(value, params, validate) {
  let number = parseString(value);
  let bound = params[0];

  if (number < bound) {
    return validate(false, `The :attribute must be ${bound} or greater.`)
  }

  validate(true);
}
