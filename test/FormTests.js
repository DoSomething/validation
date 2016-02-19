const { describe, it, before, after } = require('mocha');
const assert = require('power-assert');

// Inject jsdom globals into this test suite
before(function() {
  this.jsdom = require('jsdom-global')();
});

after(function() {
  this.jsdom(); // clean up jsdom globals
});

import Form from '../src/Form';

describe('Form', () => {

  /**
   * @tests Form
   */
  it('can serialize inputs from a form DOM element', () => {
    const el = document.createElement('form');
    el.innerHTML = `
        <input type="text" name="last_name" />
        <div class="container">
            <input type="text" name="num_things" value="7" data-validate="min:5|max:20" />
        </div>
    `;

    const form = new Form(el);

    assert.deepEqual(form, [
      {
        'name': 'last_name',
        'rules': null,
        'value': '',
      },
      {
        'name': 'num_things',
        'rules': 'min:5|max:20',
        'value': '7',
      },
    ]);
  });

});
