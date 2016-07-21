const forEach = require('lodash/forEach');

/**
 * Check whether element is <input>, <select>, or <textarea>.
 * @param {HTMLElement} el - Element to check type of.
 * @returns {boolean} - If given element is an input, select, or textarea
 */
export function isFormField(el) {
  const tag = el.tagName;
  return ( tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA' );
}

/**
 * Traverse the children of a given DOM Element and pass
 * each one to a given callback function.
 * @param {Element} element
 * @param {visitElementCallback} callback
 */
export function walk(element, callback) {
  if(element.children.length === 0) return;

  forEach(element.children, (child) => {
    /**
     * @callback visitElementCallback
     * @param {Element} child
     */
    callback(child);
    walk(child, callback);
  });
}
