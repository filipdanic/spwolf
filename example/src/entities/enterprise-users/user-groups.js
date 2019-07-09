import { getUserGroup } from '../../components/api';
import { isNotUsernameLike, isStringLongerThan } from '../../validators';
import { requiredCheck } from './shared';

export default [{
  name: 'role',
  fieldType: 'select',
  label: 'Role',
  options: [
    { label: 'Cardholder', value: 0 },
    { label: 'Monitoring', value: 1 },
    { label: 'Admin', value: 2}
  ],
  required: true,
  validationFeedbackRules: [requiredCheck],
  onChangeReset: 'userGroup',
}, {
  name: 'userGroup',
  fieldType: 'select',
  label: 'User Group (Async)',
  options: undefined,
  asyncEval: [{
    key: 'options',
    config: [getUserGroup, ['role']]
  }],
  required: true,
  validationFeedbackRules: [requiredCheck],
}, {
  name: 'userTypeInfo',
  isPresentationalElement: true,
  fieldType: 'userTypeInfo',
  dependsOn: ['role', 'userGroup'],
}, {
  name: 'username',
  fieldType: 'shortText',
  label: 'Username',
  existsIf: ['isAppUser'],
  required: true,
  validationFeedbackRules: [requiredCheck, {
    type: 'error',
    condition: isNotUsernameLike,
    label: 'Username can only contain English letters.',
    checkOnChange: true,
  }, {
    type: 'error',
    condition: isStringLongerThan(40),
    label: 'Username cannot be longer than 40 characters',
    checkOnChange: true,
  }, {
    type: 'warning',
    condition: isStringLongerThan(20),
    label: 'Are you sure you want such a long username?',
    checkOnChange: true,
  }],
}, {
  name: 'password',
  fieldType: 'shortText',
  label: 'Password',
  existsIf: ['isAppUser'],
  required: true,
  validationFeedbackRules: [requiredCheck],
}, {
  name: '2faPhoneNumber',
  fieldType: 'shortText',
  label: '2FA Phone Number',
  existsIf: ['isAdmin'],
  required: true,
  validationFeedbackRules: [requiredCheck],
}]
