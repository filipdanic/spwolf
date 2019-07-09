export const isStringLongerThan = (num) => (value) => value.length > num;

export const isNotUsernameLike = (value) => !(/^[a-zA-Z-]+$/.test(value));

export const isUndefinedOrNullOrEmptyString = (value) =>
  value === undefined || value === null || value === '';
