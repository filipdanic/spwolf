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

export const getValidateFeedbackForField = (
  field,
  validationFeedbackRules = [],
  entityState,
  checkOnlyIfCheckOnChangeSpecified
) => {
  const feedback = validationFeedbackRules
    .find(rule =>
      (checkOnlyIfCheckOnChangeSpecified ? rule.checkOnChange : true) &&
      getValidationFeedback(
        field,
        entityState,
        rule.condition,
        rule.validateWith
      ));

  return {
    hasFeedback: feedback !== undefined,
    type: (feedback || {}).type,
    label: (feedback || {}).label
  };
};
