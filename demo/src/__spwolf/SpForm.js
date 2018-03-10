'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connect = exports.FormHoC = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _fastMemoize = require('fast-memoize');

var _fastMemoize2 = _interopRequireDefault(_fastMemoize);

var _debugHelpers = require('./debugHelpers');

var _debugHelpers2 = _interopRequireDefault(_debugHelpers);

var _diff = require('./diff');

var _diff2 = _interopRequireDefault(_diff);

var _hash = require('./hash');

var _initialState = require('./initialState');

var _initialState2 = _interopRequireDefault(_initialState);

var _reducers = require('./reducers');

var _validation = require('./validation');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var flattenSections = (0, _fastMemoize2.default)(_reducers.flattenSections);

var FormHoC = function FormHoC(_ref) {
  var componentMap = _ref.componentMap,
      wrappers = _ref.wrappers;

  var SpWolfForm = function (_React$Component) {
    _inherits(SpWolfForm, _React$Component);

    function SpWolfForm(props) {
      _classCallCheck(this, SpWolfForm);

      var _this = _possibleConstructorReturn(this, (SpWolfForm.__proto__ || Object.getPrototypeOf(SpWolfForm)).call(this, props));

      _this.getFormState = function () {
        return {
          initialState: _this.state.initialState,
          state: _this.state.entityState,
          diff: (0, _diff2.default)(_this.state.initialState, _this.state.entityState)
        };
      };

      _this.updateCanSubmitForm = function (canSubmitForm) {
        _this.props.onCanSubmitFormChange && _this.props.onCanSubmitFormChange(canSubmitForm);
      };

      _this.validateForm = function () {
        var entityState = _this.state.entityState;
        var specs = _this.props.specs;

        var elements = flattenSections(specs.sections);

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
              var feedback = _this.validationFeedbackRules[element.name].find(function (rule) {
                return (0, _validation.getValidationFeedback)(element.name, entityState, rule.condition, rule.validateWith);
              });
              if (feedback && feedback.type === 'error') {
                _this.updateCanSubmitForm(false);
                return 'break';
              }
            } else if (element.required) {
              if (value === undefined || value === '') {
                _this.updateCanSubmitForm(false);
                return 'break';
              }
            }
          }
          if (i === elements.length - 1) {
            var _this$getFormState = _this.getFormState(),
                _this$getFormState$di = _this$getFormState.diff,
                diff = _this$getFormState$di === undefined ? {} : _this$getFormState$di;

            if (Object.keys(diff.diff || {}).length > 0) {
              _this.updateCanSubmitForm(true);
            } else {
              _this.updateCanSubmitForm(false);
            }
          }
        };

        for (var i = 0; i < elements.length; i += 1) {
          var _ret = _loop(i);

          if (_ret === 'break') break;
        }
      };

      _this.validateField = function (field, checkOnChangeOnly) {
        if (_this.validationFeedbackRules[field]) {
          var validationFeedback = _this.state.validationFeedback;

          var feedback = _this.validationFeedbackRules[field].find(function (rule) {
            return (checkOnChangeOnly ? rule.checkOnChange : true) && (0, _validation.getValidationFeedback)(field, _this.state.entityState, rule.condition, rule.validateWith);
          });

          validationFeedback[field] = {
            hasFeedback: feedback !== undefined,
            type: (feedback || {}).type,
            label: (feedback || {}).label
          };
          _this.setState({ validationFeedback: validationFeedback });
        }
      };

      _this.handleFieldBlur = function (field) {
        _this.validateField(field);
      };

      _this.evaluateAsyncDep = function (fn, dependants) {
        var state = dependants.reduce(function (acc, _) {
          return Object.assign({}, acc, _defineProperty({}, _, _this.state.entityState[_]));
        }, {});
        var hash = (0, _hash.getHash)(state);
        if (_this.state.cachedAsyncFields[hash]) {
          return _this.state.cachedAsyncFields[hash];
        }
        try {
          fn(state).then(function (result) {
            var cache = _this.state.cachedAsyncFields;
            cache[hash] = result;
            _this.setState({ cachedAsyncFields: cache });
          });
        } catch (err) {
          // TODO
        }
        return { asyncPending: true };
      };

      _this.calculateAllConditionalFields = function () {
        var prev = Object.assign({}, _this.state.entityState);
        var next = _this.conditionalFields.reduce(function (state, field) {
          return Object.assign({}, state, _defineProperty({}, field.name, field.fn(_this.state.entityState)));
        }, prev);
        _this.setState({ entityState: next }, function () {
          _this.validateForm();
        });
      };

      _this.handleChange = function (_ref2) {
        var key = _ref2.key,
            value = _ref2.value;

        var withReset = _this.elementsWithOnChangeReset[key] ? _defineProperty({}, _this.elementsWithOnChangeReset[key], undefined) : {};
        var entityState = Object.assign({}, _this.state.entityState, withReset, _defineProperty({}, key, value));
        _this.setState({ entityState: entityState }, function () {
          _this.dispatchChangedKey(key);
          _this.validateField(key, true);
        });
      };

      _this.dispatchChangedKey = function (key) {
        clearTimeout(_this.timer_);
        var prev = Object.assign({}, _this.state.entityState);
        var next = _this.conditionalFields.reduce(function (state, field) {
          if (field.dependsOn.some(function (dependant) {
            return dependant === key;
          })) {
            var _value = field.fn(_this.state.entityState);
            var inferredUpdates = {};
            if (_value === false) {
              inferredUpdates = (_this.visibilityMap[field.name] || []).reduce(function (acc, _) {
                return Object.assign({}, acc, _defineProperty({}, _, undefined));
              }, {});
            }
            return Object.assign({}, state, inferredUpdates, _defineProperty({}, field.name, _value));
          }
          return state;
        }, prev);
        _this.setState({ entityState: next }, function () {
          _this.timer_ = setTimeout(function () {
            return _this.validateForm();
          }, 250);
        });
      };

      _this.state = (0, _initialState2.default)(props);
      _this.handleChange_ = props.debugOnChange ? (0, _debugHelpers2.default)(_this, _this.handleChange) : _this.handleChange;
      return _this;
    }

    _createClass(SpWolfForm, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var specs = this.props.specs;
        var defineStateGetter = this.context.defineStateGetter;

        defineStateGetter && defineStateGetter(this.getFormState);
        var _specs$conditionalFie = specs.conditionalFields,
            conditionalFields = _specs$conditionalFie === undefined ? [] : _specs$conditionalFie;

        this.conditionalFields = conditionalFields;
        var elements = flattenSections(specs.sections);
        this.validationFeedbackRules = (0, _validation.flattenValidationRules)(elements);
        this.visibilityMap = (0, _reducers.formVisibilityDepMap)(elements);
        this.elementsWithOnChangeReset = (0, _reducers.formOnChangeDepList)(elements);
        this.calculateAllConditionalFields();
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _props = this.props,
            specs = _props.specs,
            sectionProps = _props.sectionProps;
        var _state = this.state,
            entityState = _state.entityState,
            validationFeedback = _state.validationFeedback;

        var Form = wrappers.form;
        var Section = wrappers.section;
        return _react2.default.createElement(
          Form,
          null,
          specs.sections.map(function (section, i) {
            return _react2.default.createElement(
              Section,
              _extends({
                key: 'section-' + i,
                index: i,
                meta: section.meta || {}
              }, sectionProps),
              section.elements.map(function (_ref4, j) {
                var fieldType = _ref4.fieldType,
                    _ref4$existsIf = _ref4.existsIf,
                    existsIf = _ref4$existsIf === undefined ? [] : _ref4$existsIf,
                    disabledIf = _ref4.disabledIf,
                    asyncEval = _ref4.asyncEval,
                    isPresentationalElement = _ref4.isPresentationalElement,
                    otherProps = _objectWithoutProperties(_ref4, ['fieldType', 'existsIf', 'disabledIf', 'asyncEval', 'isPresentationalElement']);

                var FormFieldComponent = componentMap[fieldType];
                var isVisible = existsIf.reduce(function (acc, cond) {
                  return acc && entityState[cond];
                }, true);
                var isDisabled = entityState[disabledIf] || false;

                if (!isVisible) {
                  return null;
                }

                if (isPresentationalElement) {
                  var presentationalData = (otherProps.dependsOn || []).reduce(function (acc, field) {
                    return Object.assign({}, acc, _defineProperty({}, field, entityState[field]));
                  }, {});
                  return _react2.default.createElement(FormFieldComponent, { key: 'field-' + j, data: presentationalData });
                }

                var inferredProps = {};
                if (asyncEval && Array.isArray(asyncEval) && asyncEval.length > 0) {
                  asyncEval.forEach(function (asyncSpec) {
                    inferredProps[asyncSpec.key] = _this2.evaluateAsyncDep.apply(_this2, _toConsumableArray(asyncSpec.config));
                  });
                }
                return _react2.default.createElement(FormFieldComponent, _extends({
                  className: 'margin-bottom-12',
                  key: 'field-' + j,
                  onChange: _this2.handleChange_,
                  value: entityState[otherProps.name],
                  onFieldBlur: _this2.handleFieldBlur,
                  validationFeedback: validationFeedback[otherProps.name],
                  disabled: isDisabled
                }, otherProps, inferredProps));
              })
            );
          })
        );
      }
    }]);

    return SpWolfForm;
  }(_react2.default.Component);

  SpWolfForm.propTypes = process.env.NODE_ENV !== "production" ? {
    onCanSubmitFormChange: _propTypes2.default.func,
    debugOnChange: _propTypes2.default.bool,
    specs: _propTypes2.default.shape({
      sections: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        sectionProps: _propTypes2.default.object,
        meta: _propTypes2.default.object,
        elements: _propTypes2.default.arrayOf(_propTypes2.default.shape({
          name: _propTypes2.default.string.isRequired,
          fieldType: _propTypes2.default.string.isRequired,
          required: _propTypes2.default.bool,
          isPresentationalElement: _propTypes2.default.bool,
          dependsOn: _propTypes2.default.arrayOf(_propTypes2.default.string),
          existsIf: _propTypes2.default.arrayOf(_propTypes2.default.string),
          disabledIf: _propTypes2.default.string,
          onChangeReset: _propTypes2.default.string,
          validationFeedbackRules: _propTypes2.default.arrayOf(_propTypes2.default.shape({
            type: _propTypes2.default.string.isRequired,
            condition: _propTypes2.default.func.isRequired,
            label: _propTypes2.default.string,
            checkOnChange: _propTypes2.default.bool
          }))
        })).isRequired
      })).isRequired,
      conditionalFields: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        name: _propTypes2.default.string.isRequired,
        fn: _propTypes2.default.func.isRequired,
        dependsOn: _propTypes2.default.arrayOf(_propTypes2.default.string)
      }))
    }).isRequired
  } : {};

  SpWolfForm.defaultProps = {
    onCanSubmitFormChange: undefined,
    debugOnChange: false
  };

  SpWolfForm.contextTypes = {
    defineStateGetter: _propTypes2.default.func
  };

  return SpWolfForm;
};

exports.FormHoC = FormHoC;
var connect = exports.connect = function connect(Component) {
  var Connected = function (_React$Component2) {
    _inherits(Connected, _React$Component2);

    function Connected() {
      var _ref5;

      var _temp, _this3, _ret2;

      _classCallCheck(this, Connected);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret2 = (_temp = (_this3 = _possibleConstructorReturn(this, (_ref5 = Connected.__proto__ || Object.getPrototypeOf(Connected)).call.apply(_ref5, [this].concat(args))), _this3), _this3.state = { getFormState: undefined }, _this3.defineStateGetter = function (cb) {
        _this3.setState({ getFormState: cb });
      }, _temp), _possibleConstructorReturn(_this3, _ret2);
    }

    _createClass(Connected, [{
      key: 'getChildContext',
      value: function getChildContext() {
        return {
          defineStateGetter: this.defineStateGetter
        };
      }
    }, {
      key: 'render',
      value: function render() {
        return _react2.default.createElement(Component, _extends({
          getFormState: this.state.getFormState
        }, this.props || {}));
      }
    }]);

    return Connected;
  }(_react2.default.Component);

  Connected.childContextTypes = {
    defineStateGetter: _propTypes2.default.func
  };
  return Connected;
};