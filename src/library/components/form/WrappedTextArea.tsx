import { FC } from 'react';
import { Control, Controller } from 'react-hook-form';
import { Form } from 'semantic-ui-react';

export type WrappedTextAreaProps = {
  name: string;
  control: Control<any>;
  defaultValue: string;
  label: string;
  placeholder: string;
  error?: string;
  [key: string]: any;
};

const WrappedTextArea: FC<WrappedTextAreaProps> = ({
  name,
  control,
  defaultValue,
  label,
  placeholder,
  error,
  ...rest
}) => (
  <Controller
    name={name}
    control={control}
    defaultValue={defaultValue}
    render={({ onChange, value }) => (
      <Form.TextArea
        label={label}
        placeholder={placeholder}
        error={error}
        onChange={onChange}
        value={value}
        {...rest}
      />
    )}
  />
);

export default WrappedTextArea;
