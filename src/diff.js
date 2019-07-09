import diff from './deep-object-diff'

/**
 * Returns an object with the keys `diff` and `detailedDiff`
 * based on the `deep-object-diff` module. `detailedDiff` contains
 * the keys `added`, `updated`, and `deleted`.
 *
 * @param {Object} initialState
 * @param {Object} formState
 * @return {{diff: Object, detailedDiff: { added: Object, updated: Object, deleted: Object } }}
 */
export default (initialState = {}, formState) => ({
  diff: /** @type {Object} */ (diff.diff(initialState, formState)),
  detailedDiff: /** @type {{  added: Object, updated: Object, deleted: Object }} */ (diff.detailedDiff(initialState, formState))
})
