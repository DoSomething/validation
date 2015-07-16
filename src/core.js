import keysIn from 'lodash/object/keysIn';
import map from 'lodash/collection/map';
import isString from 'lodash/lang/isString';

/**
 * Array of registered validation functions.
 * @type {Object}
 */
const validations = {};

/**
 * Return whether or not a validation exists.
 * @param {string} name - Name of validation function
 * @returns {boolean} - Validation exists
 */
function hasValidation(name) {
  return validations.hasOwnProperty(name);
}

/**
 * Register a new validation function.
 * @param {string} name - Name of validation function
 * @param {function} fn - Function, with name, value, options, and callback parameters
 */
function registerValidation(name, fn) {
  if (hasValidation(name)) {
    throw `A validation function called '${name}' has already been registered.`;
  }

  validations[name] = fn;
}

/**
 * Return a promise for the given validation.
 * @param {string} value - Value to be validated
 * @param {string} rule - Name of validation rule
 * @param {array} params - (Optional) parameters for validation rule
 * @returns {Promise} - Validation
 */
function getPromise(value, rule, params) {
  return new Promise(function(resolve, reject) {
    if (!hasValidation(rule)) {
      reject({
        message: `Validation rule '${rule}' does not exist.`,
      });
    }

    validations[rule](value, params, resolve, reject);
  });
}

/**
 * Convert a set of rules (and optional params) from a string to an array.
 * @param {string} rules - Pipe-separated rules, with optional parameters after ':'
 * @returns {object} Parsed rule name & parameters
 */
function parseRules(rules) {
  return rules.split('|').map(function(rule) {
    const [ruleName, ruleParams] = rule.split(':', 2);
    return {
      name: ruleName,
      param: ruleParams,
    };
  });
}

/**
 * Returns a promise to validate a given field.
 * @param {string} value  - Value to be validated
 * @param {string|array} rules - Rules to use for validatation
 * @returns {Promise} Promise to validate given field
 */
function validate(value, rules) {
  // Convert `rules` to array, if necessary
  const parsedRules = isString(rules) ? parseRules(rules) : rules;

  // Create a promise for each validation rule
  const promises = map(parsedRules, function(rule) {
    return getPromise(value, rule.name, rule.param);
  });

  return Promise.all(promises);
}


/**
 * Returns a promise to validate all fields in a given form.
 * @param {object} form - Object containing field names, rules, and their values
 * @param {boolean} [validateBlank=false] - Should blank fields be validated?
 * @returns {Promise} Promise to validate given fields
 */
function validateAll(form, validateBlank = false) {
  const accumulator = [];
  let ready = Promise.resolve(null);
  let hasValidationError = false;

  form.forEach(function(field) {
    // Only validate fields with a `rules` option
    if (!field.rules) return;

    // Only validate blank fields if `validateBlank` is set
    if (field.value === '' && !validateBlank) return;

    ready = ready.then(function() {
      return validate(field.value, field.rules);
    }).then(function(value) {
      accumulator.push({
        field: field.name,
        success: true,
        message: value[0].message,
      });
    }).catch(function(reason) {
      hasValidationError = true;
      accumulator.push({
        field: field.name,
        success: false,
        message: reason.message,
      });
    });
  });

  return ready.then(function() {
    if (hasValidationError) {
      throw accumulator;
    }

    return accumulator;
  });
}


/**
 * Return a list of all registered validation functions.
 * @returns {Array} List of all registered validation functions
 */
function listValidations() {
  return keysIn(validations);
}


export default { registerValidation, validate, validateAll, getPromise, hasValidation, listValidations };
