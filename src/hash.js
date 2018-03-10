export const calculateHash = (value) => {
  if (Array.isArray(value) || typeof value === 'object') {
    return JSON.stringify(value);
  }
  return `${value}`;
};

export const getHash = state =>
  Object.keys(state).reduce((acc, key) =>
    `${acc}${key}=${calculateHash(state[key])}`, '');
