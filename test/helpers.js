/**
 * Create a DOM element from a template string.
 * @param pieces
 * @param values
 * @returns {Node}
 */
export function html(pieces, ...values) {
  let result = pieces[0];
  for (let i = 0; i < values.length; ++i) {
    result += values[i] + pieces[i + 1];
  }

  let div = document.createElement('div');
  div.innerHTML = result;

  return div.firstElementChild;
}
