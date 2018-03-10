"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var flattenValidationRules = exports.flattenValidationRules = function flattenValidationRules(elements) {
  return elements.reduce(function (acc, element) {
    return Object.assign({}, acc, _defineProperty({}, element.name, element.validationFeedbackRules));
  }, {});
};

var getValidationFeedback = exports.getValidationFeedback = function getValidationFeedback(fieldName, entityState, conditionFn, validateWith) {
  if (validateWith) {
    return conditionFn(Object.assign({}, _defineProperty({}, fieldName, entityState[fieldName]), validateWith.reduce(function (acc, field) {
      return Object.assign({}, acc, _defineProperty({}, field, entityState[field]));
    }, {})));
  }
  return conditionFn(entityState[fieldName]);
};

var getValidateFeedbackForField = exports.getValidateFeedbackForField = function getValidateFeedbackForField(field) {
  var validationFeedbackRules = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var entityState = arguments[2];
  var checkOnlyIfCheckOnChangeSpecified = arguments[3];

  var feedback = validationFeedbackRules.find(function (rule) {
    return (checkOnlyIfCheckOnChangeSpecified ? rule.checkOnChange : true) && getValidationFeedback(field, entityState, rule.condition, rule.validateWith);
  });

  return {
    hasFeedback: feedback !== undefined,
    type: (feedback || {}).type,
    label: (feedback || {}).label
  };
};