# spwolf

`spwolf` is an opinionated form framework that works with React and React Native. You bring the components, validation logic, and a `spec` of your system and then cede control.

🚧 Still a work in progress

## Before Jumping In

It’s not easy to get started with `spwolf` right off the bat. While a simple setup can be done within a few minutes, you can expect to spend a lot more than that figuring out what `spwolf` does and whether or not that provides value to you.

The end goal of using this framework is to have a reliable, easy-to-edit repository of forms in your application. Making both local and global changes becomes difficult if your logic is all over the place. `spwolf` tries to provide **uniformity** and a **predictable environment.**

## Getting Started

It’s best to clone this repo and run the project in the `demo` directory. It’s an app bootstrapped with `create-react-app` that makes things easier to understand and toy with.

Step by step, this is more less what you’d to get started:

1. Add the module to your project with `yarn add spwolf`.

2. In some file `EntityForm.js` do the following:

```javascript
import { FormHOC } from 'spwolf';
import { TextInputField, CheckBoxField, SelectField, ComplexField } from '../my/form/input/elements';
import { FormWrapper, FormSection } from '../my/form/presentational/elements';

export default FormHOC({
  componentMap: {
    shortText: TextInputField,
    checkbox: CheckBoxField,
    select: SelectField,
    complex: ComplexField,
  },
  wrappers: {
    form: FormWrapper,
    section: FormSection,
  }
});
```

Now you have an initialized `spwolf` form. 

3. Now you can use this form like this:

```javascript
import { connect } from 'spwolf';
import EntityFrom from '../my/form/EntityForm';
import spec from '../my/specs/';

const MyComponent extends React.Component {
  state = { canSubmit: false };
  
  handleCanSubmitFormChange = (canSubmit) => this.setState({ canSubmit });
  
  submit = () => {
    console.log(this.props.getFormState());
  }
  
  render() {
    return(
      <Container>
        <EntityForm
          specs={spec}
          onCanSubmitFormChange={this.handleCanSubmitFormChange}
          debugOnChange
        />      
        <Button 
          disabled={!this.state.canSubmit}
          onClick={this.submit}
        >
          Submit
        </Button>
      </Container>
    );
  }
}

export default connect(MyComponent);
```

Putting aside the `spec`, the most important thing here is `connect`. By wrapping `MyComponent` with `connect` your component has access to the prop `getFormState` which will return the state of the form when you need it. You do not supply `onChange` handlers like in other implementations.

Remember, you are **ceding control** to `spwolf`. The only callback you provide is a `onCanSubmitFormChange` handler which lets you know if the Form is submittable or not. When there are not validation errors, the form can be submitted and the callback will receive `true`.

### A Note on Submitting Forms

A problem arises from the following snippet: _Why isn‘t the `Button` a part of the form?_

Should it be? If you want to, just create a wrapper component that contain the form and button. But by separating the submission mechanism from the data collection, you get freedom. Some forms might be auto-submitting. Some forms might have a save button in the navbar. `spwolf` leaves that to you. 

## The Spec Prop

Here is an example of a spec file with 3 Form sections, conditional fields, and validation logic.

```javascript
import accessControl from './access-control';
import common from './common';
import userGroups from './user-groups';

export default {
  sections: [{
    elements: common,
    meta: { title: 'User Identity' }
  }, {
    elements: userGroups,
    meta: { title: 'User Groups and Access' }
  }, {
    elements: accessControl,
    meta: { title: 'Cards' }
  }],
  conditionalFields: [{
    name: 'isAppUser',
    fn: (state) => state.role > 0,
    dependsOn: ['role'],
  }, {
    name: 'isAdmin',
    fn: (state) => state.role === 2,
    dependsOn: ['role'],
  }, {
    name: 'parityMaskNotSet',
    fn: (state) => !state.parityMaskLength,
    dependsOn: ['parityMaskLength'],
  }]
};
```

The `common` file looks like this:

```javascript
import { requiredCheck } from './shared';

export default [{
  name: 'firstName',
  fieldType: 'shortText',
  label: 'First name',
  required: true,
  validationFeedbackRules: [requiredCheck],
}, {
  name: 'lastName',
  fieldType: 'shortText',
  label: 'Last name',
}, {
  name: 'enabled',
  fieldType: 'checkbox',
  label: 'Enabled',
}];

```

There’s a lot to unpack here and the best way to really understand it is to go through the example or to look at the PropTypes declaration of `FormHOC` in `src/SpForm.js`. 


**Credits**

This module was bootstrapped for NPM with *react-component-boilerplate* and is available under the MIT license.
