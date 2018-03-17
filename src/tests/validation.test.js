import {
  flattenValidationRules,
  getValidationFeedback,
  getValidateFeedbackForField,
  canSubmitForm
} from '../validation';

describe('flattenValidationRules', () => {
  it('should return an object with <element.name>:<element.validationFeedbackRules>', () => {
    const input = [
      { name: 'foo', validationFeedbackRules: [1, 2, 3] },
      { name: 'bar', validationFeedbackRules: [4, 5, 6] }
    ];
    const output = {
      foo: [1, 2, 3],
      bar: [4, 5, 6]
    };
    expect(flattenValidationRules(input)).toEqual(output);
  });
});

describe('getValidationFeedback', () => {
  const state = { foo: 1, bar: 2 };
  it('should return true when condition matches', () => {
    const fnA = foo => foo === 1;
    expect(getValidationFeedback('foo', state, fnA, [])).toEqual(true);
  });

  it('should return false when condition does not match', () => {
    const fnB = foo => foo === 2;
    expect(getValidationFeedback('foo', state, fnB, undefined)).toEqual(false);
  });

  it('should check the validateWith argument as well', () => {
    const fnC = ({ foo, bar }) => foo === 1 && bar === 2;
    expect(getValidationFeedback('foo', state, fnC, ['bar'])).toEqual(true);
  });
});

describe('getValidateFeedbackForField', () => {
  it('should analyze rules and state and find feedback', () => {
    const rules = [{
      name: 'foo',
      validateWith: ['bar'],
      condition: ({ foo, bar }) => foo + bar === 2,
      type: 'foo',
      label: 'Foo!'
    }];
    const state = { foo: 1, bar: 1 };
    expect(getValidateFeedbackForField('foo', rules, state, false)).toEqual({
      hasFeedback: true,
      type: 'foo',
      label: 'Foo!'
    });
  });

  it('should analyze rules and state and return no feedback struct', () => {
    expect(getValidateFeedbackForField('foo', [], {}, false)).toEqual({
      hasFeedback: false,
      type: undefined,
      label: undefined
    });
  });
});

describe('canSubmitForm', () => {
  const rules = {
    bar: [{
      name: 'bar',
      condition: bar => bar < 100,
      type: 'error',
      label: 'Error!'
    }]
  };

  const elements = [
    { name: 'foo', required: true },
    { name: 'bar', existsIf: ['canHaveBar'], validationFeedbackRules: true }
  ];
  const getState = state => () => ({ diff: { diff: state } });

  it('should be possible to submit form when conditions all match', () => {
    const state = { foo: 'Foo', canHaveBar: true, bar: 1000 };
    expect(canSubmitForm(state, getState(state), elements, rules)).toEqual(true);
  });

  it('should not be possible to submit form when there is an error', () => {
    const state = { foo: 'Foo', canHaveBar: true, bar: 10 };
    expect(canSubmitForm(state, getState(state), elements, rules)).toEqual(false);
  });

  it('should not be possible to submit form when required field is missing', () => {
    const state = { foo: undefined, canHaveBar: true, bar: 1000 };
    expect(canSubmitForm(state, getState(state), elements, rules)).toEqual(false);
  });

  it('should return true by default for invalid form', () => {
    const state = { foo: undefined, canHaveBar: true, bar: 1000 };
    expect(canSubmitForm(state, getState(state), [], rules)).toEqual(true);
  });
});
