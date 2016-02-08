import Validator from '../Validator';

import min from '../rules/min';

class LaravelValidator extends Validator {
  constructor() {
    super();

    /**
     * Array of registered rules. Based on the included
     * defaults in Laravel, the PHP framework.
     * @see https://www.laravel.com/docs/5.1/Validation
     * @type {Object}
     */
    this.rules = {
      min,
    };
  }
}

export default LaravelValidator;
