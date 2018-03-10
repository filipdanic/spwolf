'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _deepObjectDiff = require('deep-object-diff');

exports.default = function () {
  var initialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var formState = arguments[1];
  return {
    diff: (0, _deepObjectDiff.diff)(initialState, formState),
    detailedDiff: (0, _deepObjectDiff.detailedDiff)(initialState, formState)
  };
};