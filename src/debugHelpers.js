export default cbFn => ({ key, value }) => {
  console.group('spForm: handleChange');
  console.log(`handleChange called for "${key}" with value: `, value);
  if (this.elementsWithOnChangeReset[key]) {
    console.log(`%cThe key ${this.elementsWithOnChangeReset[key]} will be reset.`, 'color: red;');
  }
  console.groupEnd();
  cbFn({ key, value });
};
