import { isFormField, walk } from './utilities/dom';

class Form {

  /**
   * Serialize a form object with `name`, `value`, and `rules` parameters.
   * @param {Element} formElement
   * @returns {Object}
   */
  constructor(formElement) {
    const form = [];

    // Traverse the children of the given form element and serialize any fields.
    walk(formElement, (el) => {
      if(! isFormField(el)) return;

      var name = el.getAttribute('name');
      if(!name) return;

      form.push({
        name: name,
        value: el.value,
        rules: el.getAttribute('data-validate'),
      });
    });

    return form;
  }

}

export default Form;
