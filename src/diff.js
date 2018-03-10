import { diff, detailedDiff } from 'deep-object-diff';

export default (initialState = {}, formState) => ({
  diff: diff(initialState, formState),
  detailedDiff: detailedDiff(initialState, formState)
});
