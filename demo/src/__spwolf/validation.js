'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

var canSubmitForm = exports.canSubmitForm = function canSubmitForm(entityState, getFormStateFn, specs, elements, validationFeedbackRules) {
  var _loop = function _loop(i) {
    var element = elements[i];
    var value = entityState[element.name];
    var existsInFormContext = true;
    if (element.existsIf) {
      existsInFormContext = element.existsIf.reduce(function (acc, cond) {
        return acc && entityState[cond];
      }, true);
    }

    if (existsInFormContext) {
      if (element.validationFeedbackRules) {
        var feedback = validationFeedbackRules[element.name].find(function (rule) {
          return getValidationFeedback(element.name, entityState, rule.condition, rule.validateWith);
        });
        if (feedback && feedback.type === 'error') {
          return {
            v: false
          };
        }
      } else if (element.required) {
        if (value === undefined || value === '') {
          return {
            v: false
          };
        }
      }
    }
    if (i === elements.length - 1) {
      var _getFormStateFn = getFormStateFn(),
          _getFormStateFn$diff = _getFormStateFn.diff,
          diff = _getFormStateFn$diff === undefined ? {} : _getFormStateFn$diff;

      return {
        v: Object.keys(diff.diff || {}).length > 0
      };
    }
  };

  for (var i = 0; i < elements.length; i += 1) {
    var _ret = _loop(i);

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  }
  return true;
};