/* eslint-disable */
import { isFormField } from './utilities/dom';

import Form from './Form';
import LaravelValidator from './validators/LaravelValidator';

// @TODO Ugh, bye!
const $ = window.jQuery;

const validator = new LaravelValidator;

/**
 * Show validation message in markup.
 *
 * @param {jQuery} $field - Field to display validation message for.
 * @param {Object} result - Object containing result of validation.
 * @param {String} result.message - Message to show in the form.
 * @param {String} result.suggestion - A suggestion for text to replace form input with.
 */
function showValidationMessage($field, result) {
  const $fieldLabel = $(`label[for='${$field.attr('id')}']`);
  const $fieldValidation = $fieldLabel.find('.validation');
  const $fieldMessage = $fieldValidation.find('.validation__message');
  const fieldLabelHeight = $fieldLabel.height();
  let fieldMessageHeight;

  $field.removeClass('has-success has-error has-warning shake');
  $fieldMessage.removeClass('has-success has-error has-warning');

  // Highlight/animate field
  if (result.success) {
    $field.addClass('has-success');
    $fieldMessage.addClass('has-success');
  } else {
    $field.addClass('has-error');
    $fieldMessage.addClass('has-error');

    if (isFormField($field[0])) {
      $field.addClass('shake');
    }
    // Events.emit('Validation:InlineError', $fieldLabel.attr('for'));
  }

  if (result.success === true && ! result.message) {
    let successes = ['Great!', 'Got it!', 'Looks good!', 'Awesome!'];

    result.message = successes[Math.floor(Math.random() * successes.length)];
  }

  // Show validation message
  if (result.message) {
    $fieldMessage.text(result.message);
  }

  if (result.suggestion) {
    $fieldMessage.html(`Did you mean ${result.suggestion.full}? <a href='#' data-suggestion='${result.suggestion.full}' class='js-mailcheck-fix'>Fix it!</a>`);
    // Events.emit('Validation:Suggestion', result.suggestion.domain);
  }

  fieldMessageHeight = $fieldMessage.height();

  // Set label height if it needs to be multiline.
  if (fieldMessageHeight > fieldLabelHeight) {
    $fieldLabel.css('height', fieldMessageHeight + 'px');
  } else {
    // Clear previous multiline height if no longer needed.
    $fieldLabel.css('height', '');
  }

  // Animate in the validation message
  $fieldValidation.addClass('is-showing-message');

  $('.js-suggestion-fix').on('click', function(event) {
    event.preventDefault();

    const $field = $('#' + $(this).closest('label').attr('for'));
    $field.val($(this).data('suggestion'));
    $field.trigger('blur');

    // If Google Analytics is set up, we fire an event to
    // mark that a suggestion has been made
    //Events.emit('Validation:SuggestionUsed', $(this).text() );
  });

  $field.on('focus', function() {
    $field.removeClass('has-warning has-error has-success shake');
    $fieldValidation.removeClass('is-showing-message');
    $fieldLabel.css('height', '');
  });
}


/**
 * Prepare field label DOM to display validation messages.
 * @param {jQuery} $label Label element to prepare.
 */
function prepareLabel($label) {
  // Check to make sure we haven't already prepared this before
  if($label.find('.validation').length === 0) {
    let $innerLabel = $(`<div class='validation'></div>`);
    $innerLabel.append(`<div class='validation__label'>${$label.html()}</div>`);
    $innerLabel.append(`<div class='validation__message'></div>`);

    $label.html($innerLabel);
  }
}


/**
 * Disable form submission.
 * @param {jQuery} $form Form to disable submission for.
 */
function disableFormSubmit($form) {
  let $submitButton = $form.find(':submit');
  $submitButton.attr('disabled', true);
  $submitButton.addClass('is-loading');
}


/**
 * Re-enable form submission.
 * @param {jQuery} $form Form to enable submission for.
 */
function enableFormSubmit($form) {
  let $submitButton = $form.find(':submit');
  $submitButton.attr('disabled', false);
  $submitButton.removeClass('is-loading');
}


/**
 * Show success/failure messages on the form.
 */
function showFormMessages($form, results) {
  results.forEach(function(result) {
    let $field = $form.find(`[name=${result.name}]`);
    showValidationMessage($field, result);
  });
}


/**
 * Validate fields when an individual field loses focus.
 * @param event
 */
function fieldBlurHandler(event) {
  event.preventDefault();

  let el = $(this).closest('form')[0];
  let form = new Form(el);

  validator.validateAll(form, false)
    .then(function(results) {
      showFormMessages($(el), results);
    });
}

/**
 * Validate form on submit.
 */
function formSubmitHandler(event, force = false) {
  event.preventDefault();
  event.stopPropagation();

  // After a successful validation, we re-trigger this event
  // with `force = true`. Return `true` to tell browser to submit.
  if (force) return true;

  let el = this;
  let form = new Form(el);

  // Disable form submission to prevent double-clicks.
  disableFormSubmit($(el));

  validator.validateAll(form, true)
    .then(function(results) {
      // If there are no validation errors, we should
      // submit the form by re-triggering `submit` event
      showFormMessages($(el), results);

      let failures = Array.prototype.filter.call(results, (result) => result.success === false);
      if(failures) {
        enableFormSubmit($(el));
        return;
      }

      $(el).trigger('submit', true);
    }).catch(function(err) {
      console.error(err);
    });

  // Don't submit form yet, wait for callback with `true` parameter
  return false;
}


/**
 * Set it all up! Should be run on documentReady.
 */
function init() {
  const $body = $('body');

  // Prepare the labels on any `[data-validate]` fields in the DOM at load
  $body.find('[data-validate]').each(function(el) {
    const $field = $(this);

    prepareLabel($(`label[for="${$field.attr('id')}"]`));
    $field.on('blur', fieldBlurHandler);
  });

  // Attach form submit handler
  $body.on('submit', '[data-validate-form]', formSubmitHandler);
}

export default init;
