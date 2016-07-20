var map = require('lodash/map');
var forEach = require('lodash/forEach');
var isString = require('lodash/isString');

import { parseParameter } from './utilities/parsers';

class Validator {

  /**
   * Make a new validator.
   */
  constructor() {
    /**
     * Array of registered rules.
     * @type {Object}
     */
    this.rules = {};
  }

  /**
   * Return a list of all registered validation functions.
   * @returns {Array} List of all registered validation functions
   */
  listRules() {
    return Object.keys(this.rules);
  }

  /**
   * Return whether or not a validation exists.
   * @param {String} name - Name of validation function
   * @returns {boolean} - Validation exists
   */
  hasRule(name) {
    return this.rules.hasOwnProperty(name);
  }

  /**
   * Register a new validation function.
   * @param {String} name - Name of validation function
   * @param {function} fn - Function, with name, value, options, and callback parameters
   */
  addRule(name, fn) {
    if (this.hasRule(name)) {
      throw new Error(`A validation function called '${name}' has already been registered.`);
    }

    this.rules[name] = fn;
  }

  /**
   * Return a promise for the given validation.
   * @param {String} value - Value to be validated
   * @param {String} rule - Name of validation rule
   * @param {Array} [params=[]] - (Optional) parameters for validation rule
   * @returns {Promise} - Validation
   */
  getPromise(value, rule, params = []) {
    if (! this.hasRule(rule)) {
      throw new Error(`Validation rule '${rule}' does not exist.`);
    }

    return new Promise((resolve) => {
      // Helper function for forming validation objects
      function validate(success = true, message = '') {
        resolve({success: success, message: message});
      }

      this.rules[rule](value, params, validate)
    });
  }

  /**
   * Convert a set of rules (and optional params) from a string to an array.
   * @param {String} rules - Pipe-separated rules, with optional parameters after ':'
   * @returns {Object} Parsed rule name & parameters
   */
  parseRules(rules) {
    return rules.split('|').map((rule) => {
      let [ruleName, ruleParams] = rule.split(':', 2);

      if(ruleParams) {
        ruleParams = ruleParams.split(',').map(parseParameter);
      }

      return {
        name: ruleName,
        param: ruleParams || [],
      };
    });
  }

  /**
   * Returns a promise to validate a given field.
   * @param {String} name - Field name
   * @param {String} value  - Value to be validated
   * @param {String|Array} rules - Rules to use for validation
   * @returns {Promise} Promise to validate given field
   */
  validate(name, value, rules) {
    // Convert `rules` to array, if necessary
    const parsedRules = isString(rules) ? this.parseRules(rules) : rules;

    // Create a promise for each validation rule
    const promises = map(parsedRules, (rule) => {
      return this.getPromise(value, rule.name, rule.param)
    });

    // Validate each rule, and return combined status & messages.
    return Promise.all(promises).then((results) => {
      let successes = results.filter((result) => result.success === true);
      let failures = results.filter((result) => result.success === false);

      let allSuccesses = failures.length === 0;

      // Combine messages for matching status & replace `:attribute` placeholders.
      let combinedMessages = (allSuccesses ? successes : failures).map((result) => {
        return result.message.replace(':attribute', name)
      }).filter((message) => message.length).join(' ');

      return {
        name: name,
        success: allSuccesses,
        message: combinedMessages,
      };
    }).catch((err) => {
      throw err;
    });
  }

  /**
   * Returns a promise to validate all fields in a given form.
   * @param {Object} form - Object containing field names, rules, and their values
   * @param {boolean} [validateBlank=false] - Should blank fields be validated?
   * @returns {Promise} Promise to validate given fields
   */
  validateAll(form, validateBlank = false) {
    const accumulator = [];
    let ready = Promise.resolve(null);

    forEach(form, (field) => {
      // Only validate fields with a `rules` option
      if (!field.rules) return;

      // Only validate blank fields if `validateBlank` is set
      if (field.value === '' && !validateBlank) return;

      ready = this.validate(field.name, field.value, field.rules)
        .then((result) => accumulator.push(result));
    });

    return ready.then(() => {
      return accumulator;
    }).catch((err) => {
      throw err;
    });
  }

}

export default Validator;
