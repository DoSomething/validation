import map from 'lodash/collection/map';
import forEach from 'lodash/collection/forEach';
import isString from 'lodash/lang/isString';

class Core {
  constructor() {
    /**
     * Array of registered validators.
     * @type {Object}
     */
    this.validators = {};
  }

  /**
   * Return a list of all registered validation functions.
   * @returns {Array} List of all registered validation functions
   */
  listValidators() {
    return Object.keys(this.validators);
  }

  /**
   * Return whether or not a validation exists.
   * @param {string} name - Name of validation function
   * @returns {boolean} - Validation exists
   */
  hasValidator(name) {
    return this.validators.hasOwnProperty(name);
  }

  /**
   * Register a new validation function.
   * @param {string} name - Name of validation function
   * @param {function} fn - Function, with name, value, options, and callback parameters
   */
  registerValidator(name, fn) {
    if (this.hasValidator(name)) {
      throw new Error(`A validation function called '${name}' has already been registered.`);
    }

    this.validators[name] = fn;
  }

  /**
   * Return a promise for the given validation.
   * @param {string} value - Value to be validated
   * @param {string} rule - Name of validation rule
   * @param {array} params - (Optional) parameters for validation rule
   * @returns {Promise} - Validation
   */
  getPromise(value, rule, params = []) {
    if (!this.hasValidator(rule)) {
      throw new Error(`Validation rule '${rule}' does not exist.`);
    }

    return new Promise((resolve) => this.validators[rule](value, params, resolve));
  }

  /**
   * Convert a set of rules (and optional params) from a string to an array.
   * @param {string} rules - Pipe-separated rules, with optional parameters after ':'
   * @returns {object} Parsed rule name & parameters
   */
  parseRules(rules) {
    return rules.split('|').map(function(rule) {
      const [ruleName, ruleParams] = rule.split(':', 2);
      return {
        name: ruleName,
        param: ruleParams || [],
      };
    });
  }

  /**
   * Returns a promise to validate a given field.
   * @param {string} value  - Value to be validated
   * @param {string|array} rules - Rules to use for validation
   * @returns {Promise} Promise to validate given field
   */
  validate(value, rules) {
    // Convert `rules` to array, if necessary
    const parsedRules = isString(rules) ? this.parseRules(rules) : rules;

    // Create a promise for each validation rule
    const promises = map(parsedRules, (rule) => {
      return this.getPromise(value, rule.name, rule.param)
    });

    // Validate each rule, and return false if any of them are false
    return Promise.all(promises).then((results) => {
      return results.every((result) => result === true);
    });
  }

  /**
   * Returns a promise to validate all fields in a given form.
   * @param {object} form - Object containing field names, rules, and their values
   * @param {boolean} [validateBlank=false] - Should blank fields be validated?
   * @returns {Promise} Promise to validate given fields
   */
  validateAll(form, validateBlank = false) {
    const accumulator = {};
    let ready = Promise.resolve(null);

    forEach(form, (field, name) => {
      // Only validate fields with a `rules` option
      if (!field.rules) return;

      // Only validate blank fields if `validateBlank` is set
      if (field.value === '' && !validateBlank) return;

      ready = this.validate(field.value, field.rules)
      .then((result) => {
        // @TODO: Messages!
        accumulator[name] = result;
      });
    });

    return ready.then(() => {
      return accumulator;
    });
  }
}

export default Core;
