import Validator from '../Validator';

import alpha from '../rules/alpha';
import alpha_dash from '../rules/alpha_num';
import alpha_num from '../rules/alpha_num';
import min from '../rules/min';
import max from '../rules/max';

class LaravelValidator extends Validator {
  constructor() {
    super();

    /**
     * Array of registered rules. Based on the included
     * defaults in Laravel, the PHP framework.
     * @see https://www.laravel.com/docs/5.2/Validation
     * @type {Object}
     */
    this.rules = {
      min,
      max,
      alpha,
      alpha_dash,
      alpha_num,
    };
  }
}

export default LaravelValidator;
