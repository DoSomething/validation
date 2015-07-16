import Browser from './browser';
import Core from './core';

// Export public API:
export default {
  /**
   * Main browser entry-point. Run this to hook up
   * events and prepare form fields.
   */
  init: Browser.init,

  /**
   * Core validation methods, for advanced use.
   */
  validate: Core.validate,
  registerValidation: Core.registerValidation,
  listValidations: Core.listValidations,

  /**
   * Events.
   */
  on: Core.on,
  once: Core.once,
  removeListener: Core.removeListener,
};
