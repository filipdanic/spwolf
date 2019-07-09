import { requiredCheck } from './shared';

export default [{
  name: 'firstName',
  fieldType: 'shortText',
  label: 'First name',
  required: true,
  validationFeedbackRules: [requiredCheck],
}, {
  name: 'lastName',
  fieldType: 'shortText',
  label: 'Last name',
}, {
  name: 'enabled',
  fieldType: 'checkbox',
  label: 'Enabled',
}];
