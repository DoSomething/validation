/**
 * Returns whether element is <input>, <select>, or <textarea>.
 * @param {jQuery} $el  Element to check type of.
 * @return {boolean}
 */
export function isFormField($el) {
  var tag = $el.prop('tagName');
  return ( tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA' );
}

