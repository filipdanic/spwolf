webpackJsonp([0],{590:function(e,n,t){var o=t(6),a=t(32),r=t(210).PageRenderer;r.__esModule&&(r=r.default);var i=a({displayName:"WrappedPageRenderer",getInitialState:function(){return{content:t(591)}},componentWillMount:function(){},render:function(){return o.createElement(r,Object.assign({},this.props,{content:this.state.content}))}});i.__catalog_loader__=!0,e.exports=i},591:function(e,n){e.exports="# spwolf\n\n`spwolf` is an opinionated form framework that works with React and React Native. You bring the components, validation logic, and a `spec` of your system and then cede control.\n\n\ud83d\udea7 Still a work in progress\n\n## Before Jumping In\n\nIt\u2019s not easy to get started with `spwolf` right off the bat. While a simple setup can be done within a few minutes, you can expect to spend a lot more than that figuring out what `spwolf` does and whether or not that provides value to you.\n\nThe end goal of using this framework is to have a reliable, easy-to-edit repository of forms in your application. Making both local and global changes becomes difficult if your logic is all over the place. `spwolf` tries to provide **uniformity** and a **predictable environment.**\n\n## Getting Started\n\nIt\u2019s best to clone this repo and run the project in the `demo` directory. It\u2019s an app bootstrapped with `create-react-app` that makes things easier to understand and toy with.\n\nStep by step, this is more less what you\u2019d to get started:\n\n1. Add the module to your project with `yarn add spwolf`.\n\n2. In some file `EntityForm.js` do the following:\n\n```javascript\nimport { FormHOC } from 'spwolf';\nimport { TextInputField, CheckBoxField, SelectField, ComplexField } from '../my/form/input/elements';\nimport { FormWrapper, FormSection } from '../my/form/presentational/elements';\n\nexport default FormHOC({\n  componentMap: {\n    shortText: TextInputField,\n    checkbox: CheckBoxField,\n    select: SelectField,\n    complex: ComplexField,\n  },\n  wrappers: {\n    form: FormWrapper,\n    section: FormSection,\n  }\n});\n```\n\nNow you have an initialized `spwolf` form. \n\n3. Now you can use this form like this:\n\n```javascript\nimport { connect } from 'spwolf';\nimport EntityFrom from '../my/form/EntityForm';\nimport spec from '../my/specs/';\n\nconst MyComponent extends React.Component {\n  state = { canSubmit: false };\n  \n  handleCanSubmitFormChange = (canSubmit) => this.setState({ canSubmit });\n  \n  submit = () => {\n    console.log(this.props.getFormState());\n  }\n  \n  render() {\n    return(\n      <Container>\n        <EntityForm\n          specs={spec}\n          onCanSubmitFormChange={this.handleCanSubmitFormChange}\n          debugOnChange\n        />      \n        <Button \n          disabled={!this.state.canSubmit}\n          onClick={this.submit}\n        >\n          Submit\n        </Button>\n      </Container>\n    );\n  }\n}\n\nexport default connect(MyComponent);\n```\n\nPutting aside the `spec`, the most important thing here is `connect`. By wrapping `MyComponent` with `connect` your component has access to the prop `getFormState` which will return the state of the form when you need it. You do not supply `onChange` handlers like in other implementations.\n\nRemember, you are **ceding control** to `spwolf`. The only callback you provide is a `onCanSubmitFormChange` handler which lets you know if the Form is submittable or not. When there are not validation errors, the form can be submitted and the callback will receive `true`.\n\n### A Note on Submitting Forms\n\nA problem arises from the following snippet: _Why isn\u2018t the `Button` a part of the form?_\n\nShould it be? If you want to, just create a wrapper component that contain the form and button. But by separating the submission mechanism from the data collection, you get freedom. Some forms might be auto-submitting. Some forms might have a save button in the navbar. `spwolf` leaves that to you. \n\n## The Spec Prop\n\nHere is an example of a spec file with 3 Form sections, conditional fields, and validation logic.\n\n```javascript\nimport accessControl from './access-control';\nimport common from './common';\nimport userGroups from './user-groups';\n\nexport default {\n  sections: [{\n    elements: common,\n    meta: { title: 'User Identity' }\n  }, {\n    elements: userGroups,\n    meta: { title: 'User Groups and Access' }\n  }, {\n    elements: accessControl,\n    meta: { title: 'Cards' }\n  }],\n  conditionalFields: [{\n    name: 'isAppUser',\n    fn: (state) => state.role > 0,\n    dependsOn: ['role'],\n  }, {\n    name: 'isAdmin',\n    fn: (state) => state.role === 2,\n    dependsOn: ['role'],\n  }, {\n    name: 'parityMaskNotSet',\n    fn: (state) => !state.parityMaskLength,\n    dependsOn: ['parityMaskLength'],\n  }]\n};\n```\n\nThe `common` file looks like this:\n\n```javascript\nimport { requiredCheck } from './shared';\n\nexport default [{\n  name: 'firstName',\n  fieldType: 'shortText',\n  label: 'First name',\n  required: true,\n  validationFeedbackRules: [requiredCheck],\n}, {\n  name: 'lastName',\n  fieldType: 'shortText',\n  label: 'Last name',\n}, {\n  name: 'enabled',\n  fieldType: 'checkbox',\n  label: 'Enabled',\n}];\n\n```\n\nThere\u2019s a lot to unpack here and the best way to really understand it is to go through the example or to look at the PropTypes declaration of `FormHOC` in `src/SpForm.js`. \n\n\n**Credits**\n\nThis module was bootstrapped for NPM with *react-component-boilerplate* and is available under the MIT license.\n"}});
//# sourceMappingURL=0.738a101a.chunk.js.map