import deepObjectDiff from './deep-object-diff';

/**
 * Returns an object with the keys `diff` and `detailedDiff`
 * based on the `deep-object-diff` module. Detailed diff contains
 * the keys `added`, `updated`, and `deleted`.
 *
 * @param {Object} initialState
 * @param {Object} formState
 * @return {{diff: Object, detailedDiff: { added: Object, updated: Object, deleted: Object } }}
 */
export default (initialState = {}, formState) => ({
  diff: deepObjectDiff.diff(initialState, formState),
  detailedDiff: deepObjectDiff.detailedDiff(initialState, formState)
});
