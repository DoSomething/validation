import isString from 'lodash/isString';

/**
 * The field under validation must have a minimum value.
 *
 * @param {String} value
 * @param {Array} params
 * @param resolve
 */
function min(value, params, resolve) {
  // @TODO: Should handle both strings and numbers.
  let number = parseFloat(value);
  let bound = parseFloat(params);

  return resolve(number >= bound);
}

export default min;
