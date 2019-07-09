import { isUndefinedOrNullOrEmptyString } from '../../validators';

export const requiredCheck  = {
  type: 'error',
  condition: isUndefinedOrNullOrEmptyString,
  label: 'This field is required.',
  checkOnChange: true,
};
