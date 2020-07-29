import React from 'react';
import { TextInput, FormLabel } from '@contentful/forma-36-react-components';
import { Grid } from '@contentful/forma-36-react-components/dist/components/Grid';

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
    <>
      <div className="f36-margin-top--l">
        <FormLabel htmlFor="allocation" required={true}>
          Traffic Allocation
        </FormLabel>
      </div>
      <Grid
          columnGap="spacingXl"
          columns={12}
          flow="row"
          rowGap="spacingXs"
          rows={1}
      >
        <div style={{ gridColumnStart: 'span 10', padding: '.6rem 0 0' }}>
          <input
            type="range"
            name="allocation"
            min="0"
            max="1"
            step="0.01"
            onChange={onChange}
            style={{ width: '100%' }}
            value={value.toString()}
          />
        </div>
        <div style={{ gridColumnStart: 'span 2'}}>
          <TextInput
            id="allocation"
            name="allocation"
            className="f36-margin-bottom--l"
            required={true}
            value={value.toString()}
            onChange={onChange}
            width="full"
            testId="TrafficAllocationTextField"
            min="0"
            max="1"
            step="0.01"
            type="number"
            style={{ textAlign: 'right' }}
          />
        </div>
      </Grid>
    </>
  );
};
