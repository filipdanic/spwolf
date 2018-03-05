import { diff, detailedDiff } from 'deep-object-diff';

export const calculateHash = (value) => {
  if (Array.isArray(value) || typeof value === 'object') {
    return JSON.stringify(value);
  }
  return `${value}`;
};

export const getHash = state =>
  Object.keys(state).reduce((acc, key) =>
    `${acc}${key}=${calculateHash(state[key])}`, '');

export const getDiff = (initialState = {}, formState) => ({
  diff: diff(initialState, formState),
  detailedDiff: detailedDiff(initialState, formState),
});

export const getInitialState = (props = {}) => ({
  entityState: props.initialState || {},
  cachedAsyncFields: {},
  validationFeedback: {},
  canSubmitForm: true
});

export const flattenSections = sections =>
  sections
    .reduce((acc, section) =>
      acc.concat(section.elements), [])
    .filter(_ => !_.isPresentationalElement)

export const flattenValidationRules = elements =>
  elements.reduce((acc, element) =>
    Object.assign({}, acc, { [element.name]: element.validationFeedbackRules }), {});

export const formVisibilityDepMap = elements =>
  elements
    .filter(_ => _.existsIf)
    .reduce((acc, element) => {
      element.existsIf.forEach((key) => {
        if (acc[key] === undefined) {
          acc[key] = [];
        }
        acc[key].push(element.name);
      });
      return acc;
    }, {});

export const formOnChangeDepList = elements =>
  elements
    .filter(_ => !!_.onChangeReset)
    .reduce((acc, _) =>
      Object.assign({}, acc, { [_.name]: _.onChangeReset }), {});

export const getValidationFeedback = (
  fieldName,
  entityState,
  conditionFn,
  validateWith
) => {
  if (validateWith) {
    return conditionFn(
      Object.assign(
        {},
        { [fieldName]: entityState[fieldName] },
        validateWith.reduce(
          (acc, field) =>
            Object.assign({}, acc, { [field]: entityState[field] }),
          {}
        )
      )
    );
  }
  return conditionFn(entityState[fieldName]);
};
