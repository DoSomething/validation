import { isFormField, walk } from '../../src/utilities/dom';
import { html } from '../helpers';

const assert = require('power-assert');

describe('utilities/dom', () => {
  describe('isFormField', () => {
    it('correctly identifies form elements', () => {
      const inputElement = html`<input name="first_name" value="5" />`;
      const textareaElement = html`<textarea name="why_participated">Hello World!</textarea>`;
      const selectElement = html`
        <select name="type_of_thing">
          <option>Awesome Things</option>
          <option>Popular Things</option>
          <option>Random Things</option>
        </select>
      `;
      const paragraphElement = html`<p>Any paragraph, anytime, anywhere.</p>`;

      assert(isFormField(inputElement) === true);
      assert(isFormField(textareaElement) === true);
      assert(isFormField(selectElement) === true);
      assert(isFormField(paragraphElement) === false);
    });
  });

  describe('walk', () => {
    it('does not run callback if element has no children', () => {
      const formElement = html`
        <form action="#" method="post">
        </form>
      `;

      let counter = 0;
      walk(formElement, () => counter++);

      assert(counter === 0);
    });

    it('runs callback once per child element', () => {
      const formElement = html`
        <form action="#" method="post">
          <label id="name-label" for="name">Name:</label> <!-- 1 -->
          <input id="name" type="text"> <!-- 2 -->
          <div id="actions" class="form-actions"> <!-- 3 -->
              <input id="do-it" type="submit" value="Save"> <!-- 4 -->
          </div>
          <p id="footnote">Please read our terms of service and privacy policy.</p> <!-- 5 -->
        </form>
      `;

      let ids = [];
      walk(formElement, (el) => ids.push(el.id));

      // It should have parsed the same elements as a depth-first search.
      assert.deepEqual(ids, [
        /* 1. */ 'name-label',
        /* 2. */ 'name',
        /* 3. */ 'actions',
        /* 4. */ 'do-it',
        /* 5. */ 'footnote'
      ]);
    });
  });
});
