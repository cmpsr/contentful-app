import React from 'react';
import { TextField } from '@contentful/forma-36-react-components';

export interface IMatch {
  term: string;
  eq: string;
}

export interface ITrafficAllocationProps {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TrafficAllocationTextField: React.FC<ITrafficAllocationProps> = ({
  value,
  onChange,
}) => {
  return (
    <TextField
      id="allocation"
      labelText="Traffic Allocation"
      name="allocation"
      className="f36-margin-top--m f36-margin-bottom--l"
      required={true}
      value={value.toString()}
      onChange={onChange}
      width="full"
      testId="TrafficAllocationTextField"
      textInputProps={{
        type: 'number',
        step: 0.1,
        min: 0,
        max: 1,
      }}
    />
  );
};
