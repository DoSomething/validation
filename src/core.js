import keysIn from 'lodash/object/keysIn';
import map from 'lodash/collection/map';
import isString from 'lodash/lang/isString';
//import Events from 'eventemitter3';


/**
 * Array of registered validation functions.
 * @type {Object}
 */
let validations = {};


/**
 * Return whether or not a validation exists.
 * @param name
 * @returns {boolean}
 */
function hasValidation(name) {
  return validations.hasOwnProperty(name);
}


/**
 * Register a new validation function.
 * @param name Name of validation function
 * @param fn Function, with name, value, options, and callback parameters
 */
function registerValidation(name, fn) {
  if(hasValidation(name)) {
    throw `A validation function called '${name}' has already been registered.`;
  }

  validations[name] = fn;
}


/**
 * Return a promise for the given validation.
 * @returns {Promise}
 */
function getPromise(value, rule, params) {
  return new Promise(function(resolve, reject) {
    if(!hasValidation(rule)) {
      reject({
        message: `Validation rule '${rule}' does not exist.`
      });
    }

    validations[rule](value, params, resolve, reject);
  });
}

/**
 * Convert a set of rules (and optional params) from a string to an array.
 */
function parseRules(rules) {
  return rules.split('|').map(function(rule) {
    let [ruleName, ruleParams] = rule.split(':', 2);
    return {
      name: ruleName,
      param: ruleParams
    };
  });
}


/**
 * Returns a promise to validate a given field.
 * @param value
 * @param rules
 */
function validate(value, rules) {
  // Convert `rules` to array, if necessary
  if(isString(rules)) {
    rules = parseRules(rules);
  }

  // Create a promise for each validation rule
  let promises = map(rules, function(rule) {
    return getPromise(value, rule.name, rule.param);
  });

  return Promise.all(promises);
}


/**
 * Returns a promise to validate all fields in a given form.
 * @param {Object} form - Object containing field names, rules, and their values
 * @param [validateBlank=false] - Should blank fields be validated?
 */
function validateAll(form, validateBlank = false) {
  let accumulator = [];
  let ready = Promise.resolve(null);
  let hasValidationError = false;

  form.forEach(function(field) {
    // Only validate fields with a `rules` option
    if (!field.rules) return;

    // Only validate blank fields if `validateBlank` is set
    if (field.value === '' && !validateBlank) return;

    ready = ready.then(function () {
      return validate(field.value, field.rules);
    }).then(function(value) {
      accumulator.push({
        field: field.name,
        success: true,
        message: value[0].message
      });
    }).catch(function(reason) {
      hasValidationError = true;
      accumulator.push({
        field: field.name,
        success: false,
        message: reason.message
      });
    });
  });

  return ready.then(function () {
    if(hasValidationError) {
      throw accumulator;
    }

    return accumulator;
  });
}


/**
 * Return a list of all registered validation functions.
 * @returns {Array}
 */
function listValidations() {
  return keysIn(validations);
}


export default { registerValidation, validate, validateAll, getPromise, hasValidation, listValidations };
