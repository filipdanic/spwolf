export const flattenSections = sections =>
  sections
    .reduce((acc, section) =>
      acc.concat(section.elements), [])
    .filter(_ => !_.isPresentationalElement);

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

export const formOnChangeDepList = elements =>
  elements
    .filter(_ => !!_.onChangeReset)
    .reduce((acc, _) =>
      Object.assign({}, acc, { [_.name]: _.onChangeReset }), {});

export const getStateOfDependants = (dependants, entityState) =>
  dependants.reduce((acc, _) =>
    Object.assign({}, acc, { [_]: entityState[_] }), {});
