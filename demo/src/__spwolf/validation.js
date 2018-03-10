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