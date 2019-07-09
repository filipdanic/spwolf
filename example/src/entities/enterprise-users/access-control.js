export default [{
  name: 'cards',
  fieldType: 'cards',
  label: 'Cards',
}, {
  name: 'pin',
  fieldType: 'pinCode',
  label: 'PIN',
}, {
  name: 'parityMaskLength',
  fieldType: 'maskLength',
  label: 'Parity Mask Length',
  onChangeReset: 'parityMask',
}, {
  name: 'parityMask',
  fieldType: 'shortText',
  label: 'Parity Mask',
  disabledIf: 'parityMaskNotSet',
  validationFeedbackRules: [{
    condition: ({ parityMask, parityMaskLength}) => Number.isInteger(parityMaskLength) ?
      (parityMask || '').length !== parityMaskLength : false,
    type: 'error',
    label: 'Must be same length as parity mask length.',
    checkOnChange: true,
    validateWith: ['parityMaskLength'],
  }],
}];
