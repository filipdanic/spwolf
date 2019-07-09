/**
 * HoF that accepts a context and callback and returns
 * a function that logs debug information to the console before
 * calling the callbackFunction.
 *
 * @param {Object} ctx
 * @param {Function} cbFn
 * @return {function({key: string, value?: *})}
 */
export default (ctx, cbFn) => ({ key, value }) => {
  console.group('spForm: handleChange')
  console.log(`handleChange called for "${key}" with value: `, value)
  console.log(ctx, key);
  if (ctx && ctx.elementsWithOnChangeReset_ && ctx.elementsWithOnChangeReset_[key]) {
    console.log(`%cThe key ${ctx.elementsWithOnChangeReset_[key]} will be reset.`, 'color: red;')
  }
  console.groupEnd()
  cbFn({ key, value })
}
