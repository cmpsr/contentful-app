import React from 'react';
import { IEntryFieldProps } from '../entry-fields-typing';
import { useField } from '../use-field';
import { TextField, SelectField, Option } from '@contentful/forma-36-react-components';

type EnumType = { [s: number]: string };

function mapEnum(enumerable: EnumType, fn: Function): any[] {
    // get all the members of the enum
    const enumMembers: Array<[any, string]> = Object.keys(enumerable).map((key: any) => [enumerable[key], key]);

    // we are only interested in the string identifiers as these represent the values
    const enumValues: Array<[string, string]> = enumMembers.filter(v => typeof v[0] === "string");

    // now map through the enum values
    return enumValues.map(m => fn(m[0], m[1]));
}

enum Layouts {
  Skyscraper = 'skyscraper',
  Landscape = 'landscape',
}

interface IGPTData {
  layout: Layouts;
  path: string;
}

export const GPT: React.FC<IEntryFieldProps> = ({ sdk }) => {
  const [value, setValue] = useField<IGPTData>(sdk);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        labelText="Path"
        name="path"
        id="path"
        value={value?.path ?? ""}
        required={true}
        onChange={handleChange}
      />
      <SelectField
        labelText="Layout"
        id="layout"
        name="layout"
        required={true}
        value={value?.layout ?? ''}
        onChange={handleChange}
        selectProps={{
          isDisabled: false,
          width: 'full',
        }}
      >
        <Option value={''}> </Option>
        {mapEnum(Layouts, (value: string, key: string) => (
          <Option key={key} value={value}>
            {key}
          </Option>
        ))}
      </SelectField>
    </>
  );
};
