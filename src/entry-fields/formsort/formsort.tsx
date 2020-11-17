import React from 'react';
import { IEntryFieldProps } from '../entry-fields-typing';
import { useField } from '../use-field';
import { TextField } from '@contentful/forma-36-react-components';

interface IFormsortData {
  clientLabel: string;
  flowLabel: string;
  variantLabel: string;
  formsortEnv: string;
}

export const Formsort: React.FC<IEntryFieldProps> = ({ sdk }) => {
  const [value, setValue] = useField<IFormsortData>(sdk, {
    variantLabel: "main",
    formsortEnv: "staging",
  });

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
        id="clientLabel"
        name="clientLabel"
        labelText="Client Label"
        testId="clientLabel"
        value={value?.clientLabel ?? ""}
        textInputProps={{ testId: "clientLabelInput" }}
        onChange={handleTextFieldChange}
        required={true}
      />

      <TextField
        id="flowLabel"
        name="flowLabel"
        labelText="Flow Label"
        testId="flowLabel"
        value={value?.flowLabel ?? ""}
        textInputProps={{ testId: "flowLabelInput" }}
        onChange={handleTextFieldChange}
        required={true}
      />

      <TextField
        id="variantLabel"
        name="variantLabel"
        labelText="Variant Label"
        testId="variantLabel"
        value={value?.variantLabel ?? ""}
        textInputProps={{ testId: "variantLabelInput" }}
        onChange={handleTextFieldChange}
        required={true}
      />

      <TextField
        id="formsortEnv"
        name="formsortEnv"
        labelText="Environment"
        testId="formsortEnv"
        value={value?.formsortEnv ?? ""}
        textInputProps={{ testId: "formsortEnvInput" }}
        onChange={handleTextFieldChange}
        required={true}
      />
    </>
  );
};
