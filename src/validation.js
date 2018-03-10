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

export const canSubmitForm = (
  entityState,
  getFormStateFn,
  specs,
  elements,
  validationFeedbackRules
) => {
  for (let i = 0; i < elements.length; i += 1) {
    const element = elements[i];
    const value = entityState[element.name];
    let existsInFormContext = true;
    if (element.existsIf) {
      existsInFormContext = element.existsIf
        .reduce((acc, cond) => acc && entityState[cond], true);
    }

    if (existsInFormContext) {
      if (element.validationFeedbackRules) {
        const feedback = validationFeedbackRules[element.name]
          .find(rule =>
            getValidationFeedback(
              element.name,
              entityState,
              rule.condition,
              rule.validateWith
            ));
        if (feedback && feedback.type === 'error') {
          return false;
        }
      } else if (element.required) {
        if ((value === undefined || value === '')) {
          return false;
        }
      }
    }
    if (i === elements.length - 1) {
      const { diff = {} } = getFormStateFn();
      return Object.keys(diff.diff || {}).length > 0;
    }
  }
  return true;
};
