/**
 * Check whether element is <input>, <select>, or <textarea>.
 * @param {HTMLElement} el - Element to check type of.
 * @returns {boolean} - If given element is an input, select, or textarea
 */
function isFormField(el) {
  const tag = el.tagName;
  return ( tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA' );
}

export { isFormField };
