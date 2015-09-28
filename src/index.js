import Browser from './browser';
import Core from './core';

const core = new Core();

// Export public API:
export default {
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
