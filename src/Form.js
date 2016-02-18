import { isFormField, walk } from './utilities/dom';

class Form {

  /**
   * Serialize a form object with `name`, `value`, and `rules` parameters.
   * @param {Element} formElement
   * @returns {Object}
   */
  constructor(formElement) {
    const form = {};

    walk(formElement, (el) => {
      if(! isFormField(el)) return;

      var name = el.getAttribute('name');
      if(!name) return;

      form[name] = {
        name: name,
        value: el.value,
        rules: el.getAttribute('data-validate'),
      };
    });

    return form;
  }

}

export default Form;
