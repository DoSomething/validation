import Validator from '../Validator';

import alpha from '../rules/alpha';
import alpha_dash from '../rules/alpha_num';
import alpha_num from '../rules/alpha_num';
import int from '../rules/int';
import max from '../rules/max';
import min from '../rules/min';
import required from '../rules/required';

class LaravelValidator extends Validator {
  constructor() {
    super();

    /**
     * Dictionary of registered rules. Based on the included
     * defaults in Laravel, the PHP framework.
     * @see https://www.laravel.com/docs/5.2/Validation
     * @type {Object}
     */
    this.rules = {
      alpha,
      alpha_dash,
      alpha_num,
      int,
      max,
      min,
      required,
    };

    /**
     * The validation rules that imply the field is required
     * when submitting the form.
     * @type {Array}
     */
    this.required = [
      'accepted', 'filled', 'present', 'required', 'required_if', 'required_unless',
      'required_with', 'required_with_all', 'required_without', 'required_without_all',
    ];
  }
}

export default LaravelValidator;
