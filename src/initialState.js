export default (props = {}) => ({
  initialState: props.initialState || {},
  entityState: props.initialState || {},
  cachedAsyncFields: {},
  validationFeedback: {},
  canSubmitForm: true
});
