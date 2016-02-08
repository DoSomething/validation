import { parseString } from '../utilities/parsers';

/**
 * The field under validation must have a maximum value.
 *
 * @param {String} value
 * @param {Array} params
 * @param resolve
 */
function max(value, params, resolve) {
  let number = parseString(value);
  let bound = params[0];

  return resolve(number <= bound);
}

export default max;
