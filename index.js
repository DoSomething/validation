import Browser from './src/browser';
import LaravelValidator from './src/validators/LaravelValidator';

const validator = new LaravelValidator();

// Export public API:
const Validation = {
  /*
   * Main browser entry-point. Run this to hook up
   * events and prepare form fields.
   */
  init: () => Browser.init(validator),
  showValidationMessage: (...args) => Browser.showValidationMessage(...args),

  /*
   * Validator validation methods, for advanced use.
   */
  validate: (...args) => validator.validate(...args),
  addRule: (...args) => validator.addRule(...args),
  listRules: () => validator.listRules(),

  /*
   * Events.
   */
  // @TODO Events!
  //on: (...args) => Core.on(...args),
  //once: (...args) => Core.once(...args),
  //removeListener: (...args) => Core.removeListener(...args),
};

// Export the library. It will be accessible via CommonJS/AMD,
// or as a global (window.DSValidation) in the browser.
export default Validation;
