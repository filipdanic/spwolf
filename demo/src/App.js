import React, { Component } from 'react';
import App from 'grommet/components/App';
import Article from 'grommet/components/Article';
import Button from 'grommet/components/Button';
import Header from 'grommet/components/Header';
import Section from 'grommet/components/Section';
import Box from 'grommet/components/Box';
import FormWrapper from 'grommet/components/Form';
import FormFields from 'grommet/components/FormFields';
import SendIcon from 'grommet/components/icons/base/Send';
import 'grommet/grommet.min.css';
import { FormHoC, connect } from './__spwolf';
import './App.css';
import {
  TextInputField,
  CheckBoxField,
  SelectField,
  CardsInputField,
  GeneratedPinInput,
  MaskLengthInputField,
  UserTypeInfo,
} from './components/grommet';
import enterpriseUserSpec from './entities/enterprise-users';

const FormSection = ({ children, meta }) =>
  <FormFields>
    <h3 className="section-header">
      {meta.title}
    </h3>
    {children}
  </FormFields>;

const Form = FormHoC({
  componentMap: {
    shortText: TextInputField,
    checkbox: CheckBoxField,
    select: SelectField,
    cards: CardsInputField,
    pinCode: GeneratedPinInput,
    maskLength: MaskLengthInputField,
    userTypeInfo: UserTypeInfo,
  },
  wrappers: {
    form: FormWrapper,
    section: FormSection,
  }
});

class ExampleApp extends Component {
  state = { canSubmitForm: false };

  handleSubmit = () => {
    console.log('SUBMIT: ', this.props.getFormState());
  };

  handleCanSubmitFormChange = (canSubmitForm) => {
    this.setState({ canSubmitForm });
  };

  render() {
    const { canSubmitForm } = this.state;
    return (
      <App>
        <Box>
          <Article>
            <Section pad='large' justify='center' align='center'>
              <Header>
                <h1 className="App-title"><span role="img" aria-label="wolf emoji">🐺</span> spwolf demo</h1>
              </Header>
              <div className="App-body">
                <Form
                  specs={enterpriseUserSpec}
                  onCanSubmitFormChange={this.handleCanSubmitFormChange}
                  debugOnChange
                />
                <Button
                  primary={true}
                  onClick={canSubmitForm ? this.handleSubmit : undefined}
                  icon={<SendIcon />}
                >
                  Submit Form
                </Button>
              </div>
            </Section>
          </Article>
        </Box>
      </App>
    );
  }
}



export default connect(ExampleApp);
