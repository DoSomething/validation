import { parseString } from '../utilities/parsers';

/**
 * The field under validation must have a minimum value. For string data,
 * value corresponds to the number of characters. For numeric data, value
 * corresponds to a given integer value.
 *
 * @param {String} value
 * @param {Array} params
 * @param resolve
 */
function min(value, params, resolve) {
  let number = parseString(value);
  let bound = params[0];

  return resolve(number >= bound);
}

export default min;
