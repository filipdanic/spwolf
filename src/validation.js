/**
 * Returns a map of validation rules indexed by
 * every element’s name.
 *
 * @param {Array} elements
 * @returns {Object}
 */
export const flattenValidationRules = elements =>
  elements.reduce((acc, element) =>
    Object.assign({}, acc, { [element.name]: element.validationFeedbackRules }), {});

/**
 * Returns true if there is validation feedback present
 * for the given parameters by calling the supplied
 * condition function.
 *
 * @param {string} fieldName
 * @param {Object} entityState
 * @param {Function} conditionFn
 * @param {Array.<string>} validateWith
 * @returns {boolean}
 */
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

/**
 * Returns a feedback object for the provided field.
 * By contract the only important `type` value if `error` which
 * will in turn tell the form submission is not possible.
 * User of this function need only look at the key hasFeedback to
 * determine if any feedback is present for the provided parameters.
 *
 * Not all feedback is negative, users of the framework can also use
 * feedback objects to provide additional information or success messages.
 *
 * @param {string} field
 * @param {Array} validationFeedbackRules
 * @param {Object} entityState
 * @param {boolean} checkOnlyIfCheckOnChangeSpecified
 * @returns {{hasFeedback: boolean, type: string, label: string}}
 */
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

/**
 * Returns true or false on whether the current
 * state can be saved.
 *
 * @param {Object} entityState
 * @param {Function} getFormStateFn
 * @param {Array} elements
 * @param {Object} validationFeedbackRules
 * @returns {boolean}
 */
export const canSubmitForm = (
  entityState,
  getFormStateFn,
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
