import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'fast-memoize';
import {
  getHash,
  getDiff,
  getInitialState,
  flattenSections as flattenSections_,
  flattenValidationRules,
  formVisibilityDepMap,
  getValidationFeedback,
  formOnChangeDepList
} from './utils';

const flattenSections = memoize(flattenSections_);

export const FormHoC = ({ componentMap, wrappers }) => {
  class SpWolfForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = getInitialState(props);
      this.handleChange_ = props.debugOnChange ? this.handleChangeWithDebug : this.handleChange;
    }

    componentDidMount() {
      const { specs } = this.props;
      const { defineStateGetter } = this.context;
      defineStateGetter && defineStateGetter(this.getFormState);
      const { conditionalFields = [] } = specs;
      this.conditionalFields = conditionalFields;
      const elements = flattenSections(specs.sections);
      this.validationFeedbackRules = flattenValidationRules(elements);
      this.visibilityMap = formVisibilityDepMap(elements);
      this.elementsWithOnChangeReset = formOnChangeDepList(elements);
      this.calculateAllConditionalFields();
    }

    getFormState = () => ({
      initialState: this.state.initialState,
      state: this.state.entityState,
      diff: getDiff(this.state.initialState, this.state.entityState),
    });

    updateCanSubmitForm = (canSubmitForm) => {
      this.setState({ canSubmitForm });
      this.props.onCanSubmitFormChange && this.props.onCanSubmitFormChange(canSubmitForm);
    };

    validateForm = () => {
      const { entityState } = this.state;
      const { specs } = this.props;
      const elements = flattenSections(specs.sections);

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
            const feedback = this.validationFeedbackRules[element.name]
              .find(rule =>
                getValidationFeedback(
                  element.name,
                  entityState,
                  rule.condition,
                  rule.validateWith
                ));
            if (feedback && feedback.type === 'error') {
              this.updateCanSubmitForm(false);
              break;
            }
          } else if (element.required) {
            if ((value === undefined || value === '')) {
              this.updateCanSubmitForm(false);
              break;
            }
          }
        }
        if (i === elements.length - 1) {
          const { diff } = this.getFormState();
          if (Object.keys(diff).length > 0) {
            this.updateCanSubmitForm(true);
          } else {
            this.updateCanSubmitForm(false);
          }
        }
      }
    };

    validateField = (field, checkOnChangeOnly) => {
      if (this.validationFeedbackRules[field]) {
        const { validationFeedback } = this.state;
        const feedback = this.validationFeedbackRules[field]
          .find(rule =>
            (checkOnChangeOnly ? rule.checkOnChange : true) &&
            getValidationFeedback(
              field,
              this.state.entityState,
              rule.condition,
              rule.validateWith
            ));

        validationFeedback[field] = {
          hasFeedback: feedback !== undefined,
          type: (feedback || {}).type,
          label: (feedback || {}).label
        };
        this.setState({ validationFeedback });
      }
    };

    handleFieldBlur = (field) => {
      this.validateField(field);
    };

    evaluateAsyncDep = (fn, dependants) => {
      const state = dependants.reduce((acc, _) =>
        Object.assign({}, acc, { [_]: this.state.entityState[_] }), {});
      const hash = getHash(state);
      if (this.state.cachedAsyncFields[hash]) {
        return this.state.cachedAsyncFields[hash];
      }
      try {
        fn(state).then((result) => {
          const cache = this.state.cachedAsyncFields;
          cache[hash] = result;
          this.setState({ cachedAsyncFields: cache });
        });
      } catch (err) {
        // TODO
      }
      return { asyncPending: true };
    };

    calculateAllConditionalFields = () => {
      const prev = Object.assign({}, this.state.entityState);
      const next = this.conditionalFields.reduce((state, field) => {
        return Object.assign({}, state, { [field.name]: field.fn(this.state.entityState) });
      }, prev);
      this.setState({ entityState: next }, () => {
        this.validateForm();
      });
    };

    handleChangeWithDebug = ({ key, value }) => {
      const withReset = this.elementsWithOnChangeReset[key] ? {
        [this.elementsWithOnChangeReset[key]]: undefined,
      } : {};
      console.group('spForm: handleChange');
      console.log(`handleChange called for "${key}" with value: `, value);
      const entityState = Object.assign(
        {},
        this.state.entityState,
        withReset,
        { [key]: value }
      );
      if (this.elementsWithOnChangeReset[key]) {
        console.log(`%cThe key ${this.elementsWithOnChangeReset[key]} will be reset.`, 'color: red;');
      }
      console.log('Diff: ', getDiff(this.state.entityState, entityState));
      console.groupEnd();
      this.setState({ entityState }, () => {
        this.dispatchChangedKey(key);
        this.validateField(key, true);
      });
    };

    handleChange = ({ key, value }) => {
      const withReset = this.elementsWithOnChangeReset[key] ? {
        [this.elementsWithOnChangeReset[key]]: undefined,
      } : {};
      const entityState = Object.assign(
        {},
        this.state.entityState,
        withReset,
        { [key]: value }
      );
      this.setState({ entityState }, () => {
        this.dispatchChangedKey(key);
        this.validateField(key, true);
      });
    };

    dispatchChangedKey = (key) => {
      clearTimeout(this.timer_);
      const prev = Object.assign({}, this.state.entityState);
      const next = this.conditionalFields.reduce((state, field) => {
        if (field.dependsOn.some(dependant => dependant === key)) {
          const value = field.fn(this.state.entityState);
          let inferredUpdates = {};
          if (value === false) {
            inferredUpdates = (this.visibilityMap[field.name] || [])
              .reduce((acc, _) =>
                Object.assign({}, acc, { [_]: undefined }), {});
          }
          return Object.assign({}, state, inferredUpdates, { [field.name]: value });
        }
        return state;
      }, prev);
      this.setState({ entityState: next }, () => {
        this.timer_ = setTimeout(() => this.validateForm(), 250);
      });
    };

    render() {
      const { specs, sectionProps } = this.props;
      const { entityState, validationFeedback } = this.state;
      const Form = wrappers.form;
      const Section = wrappers.section;
      return (
        <Form>
          {specs.sections.map((section, i) =>
            <Section
              key={`section-${i}`}
              index={i}
              meta={section.meta || {}}
              {...sectionProps}
            >
              {section.elements.map(({
                 fieldType,
                 existsIf = [],
                 disabledIf,
                 asyncEval,
                 isPresentationalElement,
                 ...otherProps
               }, j) => {
                const FormFieldComponent = componentMap[fieldType];
                const isVisible = existsIf.reduce((acc, cond) => acc && entityState[cond], true);
                const isDisabled = entityState[disabledIf] || false;

                if (!isVisible) {
                  return null;
                }

                if (isPresentationalElement) {
                  const presentationalData = (otherProps.dependsOn || [])
                    .reduce((acc, field) =>
                      Object.assign({}, acc, { [field]: entityState[field] }), {});
                  return <FormFieldComponent key={`field-${j}`} data={presentationalData} />;
                }

                const inferredProps = {};
                if (asyncEval && Array.isArray(asyncEval) && asyncEval.length > 0) {
                  asyncEval.forEach((asyncSpec) => {
                    inferredProps[asyncSpec.key] = this.evaluateAsyncDep(...asyncSpec.config);
                  });
                }
                return (
                  <FormFieldComponent
                    className="margin-bottom-12"
                    key={`field-${j}`}
                    onChange={this.handleChange_}
                    value={entityState[otherProps.name]}
                    onFieldBlur={this.handleFieldBlur}
                    validationFeedback={validationFeedback[otherProps.name]}
                    disabled={isDisabled}
                    {...otherProps}
                    {...inferredProps}
                  />
                );
                })}
            </Section>)}
        </Form>
      );
    }
  }

  SpWolfForm.propTypes = {
    onCanSubmitFormChange: PropTypes.func,
    debugOnChange: PropTypes.bool,
    specs: PropTypes.shape({
      sections: PropTypes.arrayOf(PropTypes.shape({
        meta: PropTypes.object,
        elements: PropTypes.arrayOf(PropTypes.shape({
          name: PropTypes.string.isRequired,
          fieldType: PropTypes.string.isRequired,
          required: PropTypes.bool,
          isPresentationalElement: PropTypes.bool,
          dependsOn: PropTypes.arrayOf(PropTypes.string),
          existsIf: PropTypes.arrayOf(PropTypes.string),
          disabledIf: PropTypes.string,
          onChangeReset: PropTypes.string,
          validationFeedbackRules: PropTypes.arrayOf(PropTypes.shape({
            type: PropTypes.string.isRequired,
            condition: PropTypes.func.isRequired,
            label: PropTypes.string,
            checkOnChange: PropTypes.bool
          }))
        })).isRequired
      })).isRequired,
      conditionalFields: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        fn: PropTypes.func.isRequired,
        dependsOn: PropTypes.arrayOf(PropTypes.string)
      }))
    }).isRequired
  };

  SpWolfForm.defaultProps = {
    onCanSubmitFormChange: undefined,
    debugOnChange: false
  };

  SpWolfForm.contextTypes = {
    defineStateGetter: PropTypes.func
  };

  return SpWolfForm;
};

export const connect = (Component) => {
  class Connected extends React.Component {
    state = { getFormState: undefined };

    defineStateGetter = (cb) => {
      this.setState({ getFormState: cb });
    };

    getChildContext() {
      return {
        defineStateGetter: this.defineStateGetter
      };
    }

    render() {
      return (
        <Component getFormState={this.state.getFormState} {...(this.props || {})} />
      );
    }
  }

  Connected.childContextTypes = {
    defineStateGetter: PropTypes.func
  };
  return Connected;
};
