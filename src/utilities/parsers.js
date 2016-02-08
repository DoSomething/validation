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
