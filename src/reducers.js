/**
 * Flatters the sections array and produces a list
 * of spec elements.
 * @param {Array} sections
 * @returns {Array}
 */
export const flattenSections = sections =>
  sections
    .reduce((acc, section) =>
      acc.concat(section.elements), [])
    .filter(_ => !_.isPresentationalElement);


/**
 * Creates an object describing visibility dependencies
 * based on the provided array of spec elements.
 *
 * @param {Array} elements
 * @returns {Object}
 */
export const formVisibilityDepMap = elements =>
  elements
    .filter(_ => _.existsIf)
    .reduce((acc, element) => {
      element.existsIf.forEach((key) => {
        if (acc[key] === undefined) {
          acc[key] = [];
        }
        acc[key].push(element.name);
      });
      return acc;
    }, {});

/**
 * Creates an object describing onChange dependencies
 * based on the provided array of spec elements.
 *
 * @param {Array} elements
 * @returns {Object}
 */
export const formOnChangeDepMap = elements =>
  elements
    .filter(_ => !!_.onChangeReset)
    .reduce((acc, _) =>
      Object.assign({}, acc, { [_.name]: _.onChangeReset }), {});

/**
 * Given a list of dependants and the current
 * entity state, returns a new object with the
 * key-value pair of all the dependants.
 *
 * @param {Array} dependants
 * @param {Object} entityState
 * @returns {Object}
 */
export const getStateOfDependants = (dependants, entityState) =>
  dependants.reduce((acc, _) =>
    Object.assign({}, acc, { [_]: entityState[_] }), {});
