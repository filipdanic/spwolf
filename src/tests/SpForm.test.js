import React from 'react'
import renderer from 'react-test-renderer'
import { FormHOC } from '../SpForm'

const TextField = ({ label, value, onChange, required, name }) => (
  <label htmlFor={name}>
    {label}
    <input
      name={name}
      id={name}
      required={required}
      type='text'
      value={value}
      onChange={onChange}
    />
  </label>
)

const SectionWrap = ({ children, meta }) => (
  <div>
    <h2 style={meta.bold ? { fontWeight: 700 } : {}}>
      {meta.title}
    </h2>
    <div>
      {children}
    </div>
  </div>
)
const FormWrap = ({ children }) => <div>{children}</div>
const specs = {
  sections: [{
    elements: [{
      name: 'foo',
      fieldType: 'text',
      label: 'Foo',
      required: true
    }],
    meta: { title: 'Foo', bold: true }
  }, {
    elements: [{
      name: 'bar',
      fieldType: 'text',
      label: 'Bar'
    }, {
      name: 'barConditional',
      fieldType: 'text',
      label: 'Bar Conditional',
      disabledIf: 'isBarInvalid'
    }],
    meta: { title: 'Bar' }
  }],
  conditionalFields: [{
    name: 'isBarInvalid',
    fn: state => !(state.bar) || state.bar.length > 20,
    dependsOn: ['bar']
  }]
}

describe('SpWolf', () => {
  it('renders SpWolf component correctly after initializing via FormHOC', () => {
    const SpWolf = FormHOC({
      componentMap: {
        text: TextField
      },
      wrappers: {
        form: FormWrap,
        section: SectionWrap
      }
    })
    const tree = renderer.create(<SpWolf
      initialState={{ foo: 'foofoo' }}
      specs={specs}
      onCanSubmitFormChange={val => console.log(val)}
    />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
