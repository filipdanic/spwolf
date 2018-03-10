'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var calculateHash = exports.calculateHash = function calculateHash(value) {
  if (Array.isArray(value) || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
    return JSON.stringify(value);
  }
  return '' + value;
};

var getHash = exports.getHash = function getHash(state) {
  return Object.keys(state).reduce(function (acc, key) {
    return '' + acc + key + '=' + calculateHash(state[key]);
  }, '');
};