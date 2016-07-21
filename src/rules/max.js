import { parseString } from '../utilities/parsers';

/**
 * The field under validation must have a maximum value.
 *
 * @param {String} value
 * @param {Array} params
 * @param {Validator.getPromise.validate} validate
 */
export default function max(value, params, validate) {
  let number = parseString(value);
  let bound = params[0];

  if (number > bound) {
    return validate(false, `The :attribute must be ${bound} or less.`)
  }

  validate(true);
}
