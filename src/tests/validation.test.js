import {
  flattenValidationRules,
  getValidationFeedback
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
    expect(getValidationFeedback('foo', state, fnB, [])).toEqual(false);
  });

  it('should check the validateWith argument as well', () => {
    const fnC = ({ foo, bar }) => foo === 1 && bar === 2;
    expect(getValidationFeedback('foo', state, fnC, ['bar'])).toEqual(true);
  });
});
