import Browser from './browser';
import Core from './Core';

const core = new Core();

// Export public API:
const Validation = {
  /*
   * Main browser entry-point. Run this to hook up
   * events and prepare form fields.
   */
  init: () => Browser.init(core),
  showValidationMessage: (...args) => Browser.showValidationMessage(...args),

  /*
   * Core validation methods, for advanced use.
   */
  validate: (...args) => core.validate(...args),
  registerValidator: (...args) => core.registerValidator(...args),
  listValidators: () => core.listValidators(),

  /*
   * Events.
   */
  on: (...args) => Core.on(...args),
  once: (...args) => Core.once(...args),
  removeListener: (...args) => Core.removeListener(...args),
};

// Export the library. It will be accessible via CommonJS/AMD,
// or as a global (window.DSValidation) in the browser.
export default Validation;
