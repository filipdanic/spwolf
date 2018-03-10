export default (ctx, cbFn) => ({ key, value }) => {
  console.group('spForm: handleChange');
  console.log(`handleChange called for "${key}" with value: `, value);
  if (ctx.elementsWithOnChangeReset[key]) {
    console.log(`%cThe key ${ctx.elementsWithOnChangeReset[key]} will be reset.`, 'color: red;');
  }
  console.groupEnd();
  cbFn({ key, value });
};
