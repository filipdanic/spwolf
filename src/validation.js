export const flattenValidationRules = elements =>
  elements.reduce((acc, element) =>
    Object.assign({}, acc, { [element.name]: element.validationFeedbackRules }), {});

export const getValidationFeedback = (
  fieldName,
  entityState,
  conditionFn,
  validateWith
) => {
  if (validateWith) {
    return conditionFn(Object.assign(
      {},
      { [fieldName]: entityState[fieldName] },
      validateWith.reduce(
        (acc, field) =>
          Object.assign({}, acc, { [field]: entityState[field] }),
        {}
      )
    ));
  }
  return conditionFn(entityState[fieldName]);
};
