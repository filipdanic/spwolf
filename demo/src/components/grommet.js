import React from 'react';
import Spinning from 'grommet/components/icons/Spinning';
import TextInput from 'grommet/components/TextInput';
import CheckBox from 'grommet/components/CheckBox';
import Select from 'grommet/components/Select';
import Button from 'grommet/components/Button';
import NumberInput from 'grommet/components/NumberInput';
import AddIcon from 'grommet/components/icons/base/Add';
import License from 'grommet/components/icons/base/License';
import CircleInformationIcon from 'grommet/components/icons/base/CircleInformation';
import { generatePIN } from './api';

const ValidationFeedbackMessage = ({ feedback }) =>
  feedback && feedback.type ?
    <div className={`feedback-${feedback.type}`}>{feedback.label}</div> :
    null;

export const TextInputField = ({ label, name, value, onChange, required, className, disabled, validationFeedback, onFieldBlur }) =>
  <div>
    <label style={{ display: 'block' }}>{label} {required && <span>*</span>}</label>
    <TextInput
      id={name}
      name={name}
      value={value === undefined ? '' : value}
      onDOMChange={(e) => onChange({ key: name, value: e.target.value })}
      onBlur={() => onFieldBlur(name)}
      className={className}
      disabled={disabled}
    />
    <ValidationFeedbackMessage feedback={validationFeedback} />
  </div>;

export const MaskLengthInputField = ({ label, name, value, onChange, required, className, validationFeedback, onFieldBlur }) =>
  <div>
    <label style={{ display: 'block' }}>{label} {required && <span>*</span>}</label>
    <NumberInput
      id={name}
      name={name}
      value={value === undefined ? 0 : value}
      onChange={(e) => onChange({ key: name, value: Number(e.target.value) })}
      onBlur={() => onFieldBlur(name)}
      className={className}
      min={0}
      max={32}
    />
    <ValidationFeedbackMessage feedback={validationFeedback} />
  </div>;

export const CheckBoxField = ({ label, name, value, onChange, className }) =>
  <CheckBox
    id={name}
    name={name}
    label={label}
    checked={value === undefined ? false : value}
    onChange={(e) => onChange({ key: name, value: e.target.checked })}
    className={className}
  />;

export const SelectField = ({ label, name, value, options, onChange, required, className }) =>
  <div>
    <label style={{ display: 'block' }}>{label} {required && <span>*</span>}</label>
    <div className="select-field-wrapper">
      <Select
        label={label}
        name={name}
        options={Array.isArray(options) ? options : []}
        disabled={!Array.isArray(options)}
        value={value !== undefined  && Array.isArray(options) ? (options.find(_ => _.value === value) || {}).label : undefined}
        onChange={({ option }) => onChange({ key: name, value: option.value })}
        className={className}
      />
      {options && options.asyncPending &&
        <div className="select-field-wrapper--spinner"><Spinning /></div>}
    </div>
  </div>;


const formCardArray = (list, index, value) => {
  const l = [...list];
  l[index] = value;
  return l;
};

const addOne = (list) => {
  const l = [...(list || [])];
  l.push('');
  return l;
};

export const CardsInputField = ({ label, name, value, onChange, required, className }) =>
  <div>
    <label style={{ display: 'block' }}>{label} {required && <span>*</span>}</label>
    {(value || []).map((card, index) =>
      <TextInput
        style={{ display: 'block' }}
        key={`${name}.${index}`}
        id={`${name}.${index}`}
        name={`${name}.${index}`}
        value={card === undefined ? '' : card}
        className={className}
        onDOMChange={(e) => onChange({
          key: name,
          value: formCardArray(value, index, e.target.value)
        })}
      />
    )}
    <Button
      icon={<AddIcon />}
      label='Add Card'
      onClick={() => onChange({
        key: name,
        value: addOne(value)
      })}
      plain
    />
  </div>;

export class GeneratedPinInput extends React.Component {
  state = {};

  handleClick = async () => {
    if (!this.state.asyncPending) {
      this.setState({ asyncPending: true });
      try {
        const value = await generatePIN();
        this.props.onChange({ key: this.props.name, value });
        this.setState({ asyncPending: false });
      } catch (e) {
        this.setState({ asyncPending: false });
      }
    }
  };

  render() {
    const { asyncPending } = this.state;
    const {label, name, value, required } = this.props;
    return (
      <div>
        <label style={{display: 'block'}}>{label} {required && <span>*</span>}</label>
        <div className="select-field-wrapper">
          <TextInput
            label={label}
            name={name}
            disabled={true}
            value={value === undefined ? '' : String(value)}
          />
          <Button
            icon={<License/>}
            label='Generate PIN'
            onClick={this.handleClick}
            disabled={asyncPending}
            plain
          />
          {asyncPending &&
            <div className="select-field-wrapper--spinner"><Spinning /></div>}
        </div>
      </div>
    );
  }
}

const groupMap = {
  0: 'Visitor',
  1: 'Staff',
  2: 'Camera Monitor',
  3: 'Full System Monitor',
  4: 'Monitoring Manager',
  5: 'Full System Admin',
};

const getRoleMessage = (role, group) => {
  switch (role) {
    case 2:
      return `An administrator will be created and assigned to the ${groupMap[group]} group. They will be able to login with a username and password and most provide a valid phone number for two factor authentication.`;
    case 1:
      return `A monitoring operative will be created and assigned to the ${groupMap[group]} group. They will be able to login with a username and password.`;
    case 0:
    default:
      return `A cardholder will be created and assigned to the ${groupMap[group]} group.`;
  }
};

export const UserTypeInfo = ({ data = {} }) =>
  Number.isInteger(data.role) && Number.isInteger(data.userGroup) ?
  <label className="user-type-info">
    <CircleInformationIcon size="xsmall" />
    {getRoleMessage(data.role, data.userGroup)}
  </label> : null;
