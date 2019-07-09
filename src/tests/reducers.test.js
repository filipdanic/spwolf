import {
  flattenSections,
  formVisibilityDepMap,
  formOnChangeDepMap,
  getStateOfDependants
} from '../reducers'

const sections = [
  { elements: [{ val: 1 }, { val: 2 }, { val: 3 }] },
  { elements: [{ val: 4 }, { val: 5 }, { val: 6 }] }
]

describe('flattenSections', () => {
  it('flattens an array of sections and returns only the spec elements', () => {
    expect(flattenSections(sections)).toEqual([...sections[0].elements, ...sections[1].elements])
  })
  it('does not include presentational elements', () => {
    const sectionsAlt = [
      { elements: [{ val: 1 }, { val: 2 }, { val: 3 }, { isPresentationalElement: true }] },
      { elements: [{ val: 4 }, { isPresentationalElement: true }, { val: 5 }, { val: 6 }] }
    ]
    expect(flattenSections(sectionsAlt)).toEqual([
      ...sections[0].elements,
      ...sections[1].elements
    ])
  })
})

describe('formVisibilityDepMap', () => {
  const elements = [
    {},
    { name: 'foo', existsIf: ['a', 'b'] },
    { name: 'bar', existsIf: ['c'] },
    { name: 'fooBar', existsIf: ['a'] }
  ]
  it('forms a hash map with <existsIf[i]>:[<el.name>]', () => {
    expect(formVisibilityDepMap(elements)).toEqual({ a: ['foo', 'fooBar'], b: ['foo'], c: ['bar'] })
  })
})

describe('formOnChangeDepMap', () => {
  const elements = [{ name: 'foo', onChangeReset: ['a', 'b'] }, { name: 'bar', onChangeReset: ['c'] }]
  it('forms a hash map with <element.name>:<elemnt.onChangeReset>', () => {
    expect(formOnChangeDepMap(elements)).toEqual({ foo: ['a', 'b'], bar: ['c'] })
  })
})

describe('getStateOfDependants', () => {
  const state = {
    a: 1,
    b: 2,
    c: 3,
    d: 4
  }
  const deps = ['a', 'd']
  it('returns only the specified keys and their values from the state', () => {
    expect(getStateOfDependants(deps, state)).toEqual({ a: 1, d: 4 })
  })
})
