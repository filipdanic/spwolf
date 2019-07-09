import getInitialState from '../getInitialState'

describe('initialState', () => {
  it('should return expected structure', () => {
    const props = { initialState: { a: 1 } }
    expect(getInitialState(props)).toEqual({
      initialState: props.initialState,
      entityState: props.initialState,
      cachedAsyncFields: {},
      validationFeedback: {},
      canSubmitForm: true
    })
  })
  it('should handle case where props or props.initialState is undefined', () => {
    expect(getInitialState({})).toEqual({
      initialState: {},
      entityState: {},
      cachedAsyncFields: {},
      validationFeedback: {},
      canSubmitForm: true
    })
    expect(getInitialState()).toEqual({
      initialState: {},
      entityState: {},
      cachedAsyncFields: {},
      validationFeedback: {},
      canSubmitForm: true
    })
  })
})
