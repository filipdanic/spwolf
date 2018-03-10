'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (ctx, cbFn) {
  return function (_ref) {
    var key = _ref.key,
        value = _ref.value;

    console.group('spForm: handleChange');
    console.log('handleChange called for "' + key + '" with value: ', value);
    if (ctx.elementsWithOnChangeReset[key]) {
      console.log('%cThe key ' + ctx.elementsWithOnChangeReset[key] + ' will be reset.', 'color: red;');
    }
    console.groupEnd();
    cbFn({ key: key, value: value });
  };
};