/**
 * Parse a string into either a integer or numeral value.
 * @param {String} string
 * @return int|float
 */
export function parseString(string) {
  let number = parseFloat(string.trim());

  // If the string can't be parsed as a integer/float, return it's length.
  if(isNaN(number)) {
    return string.length;
  }

  // Otherwise, return the number.
  return number;
}

/**
 * Parse parameter values for rules.
 * @param {String} value - raw parameter value
 * @returns {int|float|boolean|string} - formatted value
 */
export function parseParameter(value) {
  value = value.trim();

  // Try to parse parameter as a boolean.
  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;

  // Try to parse parameter as a float or integer.
  let number = parseFloat(value);
  if (!isNaN(number)) {
    return number;
  }

  return value;
}
