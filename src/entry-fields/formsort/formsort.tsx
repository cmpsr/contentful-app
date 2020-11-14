import React from 'react';
import { IEntryFieldProps } from '../entry-fields-typing';
import { useField } from '../use-field';
import { TextField } from '@contentful/forma-36-react-components';

interface IFormsortData {
  url: string;
}

export const Formsort: React.FC<IEntryFieldProps> = ({ sdk }) => {
  const [value, setValue] = useField<IFormsortData>(sdk);

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name: string = e.currentTarget.getAttribute('name') || '';
    let val: string | number = e.currentTarget.value;
    if (e.currentTarget.getAttribute('type') === 'number') {
      val = Number(val);
      if (isNaN(val)) {
        val = 0;
      }
    }
    setValue({
      ...value,
      [name]: val,
    });
  };

  return (
    <>
      <TextField
        id="url"
        name="url"
        labelText="URL"
        testId="url"
        value={value?.url ?? ""}
        textInputProps={{ testId: "urlInput" }}
        onChange={handleTextFieldChange}
      />
    </>
  );
};
