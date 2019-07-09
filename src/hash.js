/**
 * Simple hash calculation of provided value. Either
 * turns it into a string or stringify it if object or array.
 * @param value
 * @return {string}
 */
export const calculateHashOfValue = (value) => {
  if (Array.isArray(value) || typeof value === 'object') {
    return JSON.stringify(value)
  }
  return `${value}`
}

/**
 * Given a state object of key/values pairs, creates a string
 * with patterns `key1=value1||key2=value2||`. Meant to be used for small
 * objects with a couple of keys in order to provide a simple hash
 * that’s easy to debug.
 *
 * User is expected to provide their own hashing algorithm for
 * more complex use cases.
 * @param {Object} state
 * @return {string}
 */
export const getHash = state => {
  return Object.keys(state).reduce((acc, key) =>
    `${acc}${key}=${calculateHashOfValue(state[key])}||`, '')
}
