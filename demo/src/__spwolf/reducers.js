"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var flattenSections = exports.flattenSections = function flattenSections(sections) {
  return sections.reduce(function (acc, section) {
    return acc.concat(section.elements);
  }, []).filter(function (_) {
    return !_.isPresentationalElement;
  });
};

var formVisibilityDepMap = exports.formVisibilityDepMap = function formVisibilityDepMap(elements) {
  return elements.filter(function (_) {
    return _.existsIf;
  }).reduce(function (acc, element) {
    element.existsIf.forEach(function (key) {
      if (acc[key] === undefined) {
        acc[key] = [];
      }
      acc[key].push(element.name);
    });
    return acc;
  }, {});
};

var formOnChangeDepList = exports.formOnChangeDepList = function formOnChangeDepList(elements) {
  return elements.filter(function (_) {
    return !!_.onChangeReset;
  }).reduce(function (acc, _) {
    return Object.assign({}, acc, _defineProperty({}, _.name, _.onChangeReset));
  }, {});
};

var getStateOfDependants = exports.getStateOfDependants = function getStateOfDependants(dependants, entityState) {
  return dependants.reduce(function (acc, _) {
    return Object.assign({}, acc, _defineProperty({}, _, entityState[_]));
  }, {});
};