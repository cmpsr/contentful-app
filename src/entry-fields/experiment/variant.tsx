import React from 'react';
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import {
  TextField,
  SelectField,
  Option,
  TextLink,
  IconButton,
} from '@contentful/forma-36-react-components';
import { Grid } from '@contentful/forma-36-react-components/dist/components/Grid';
import { VariantMatch, IMatch } from './variant-match';
import { VariantTraffic } from './variant-traffic';
import { VariantPage } from './variant-page';
import './variant.css';

export const BACKENDS = ['backend-1', 'backend-2'];

export interface IVariantData {
  id?: string;
  url?: string;
  name: string;
  traffic: number;
  lockTraffic: boolean;
  backend?: string;
  match?: IMatch[];
}

export interface IVariantProps {
  data: IVariantData;
  sdk: FieldExtensionSDK;
  index: number;
  onChange: (data: IVariantData, index: number) => void;
  onBalanceTraffic: (allocation: number, index: number) => void;
  onDelete: (index: number) => void;
}

export const Variant: React.FC<IVariantProps> = ({
  data,
  sdk,
  index,
  onChange,
  onBalanceTraffic,
  onDelete,
}) => {
  const handleDelete = () => onDelete(index);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const name: string = e.currentTarget.getAttribute('name') || '';
      if (name === '') {
        return;
      }
      const value = e.currentTarget.value;
      if (e.currentTarget.getAttribute('type') === 'number') {
        const numValue = Number(value);
        onChange(
          {
            ...data,
            [name]: numValue,
          },
          index,
        );
      } else {
        onChange(
          {
            ...data,
            [name]: value,
          },
          index,
        );
      }
    },
    [onChange, data, index],
  );

  const handleBalanceTraffic = React.useCallback(
    (value: number) => {
      onBalanceTraffic(value, index);
    },
    [index, onBalanceTraffic],
  );

  const handleToggleLock = React.useCallback(() => {
    onChange(
      {
        ...data,
        lockTraffic: !data.lockTraffic,
      },
      index,
    );
  }, [onChange, data, index]);

  const handleMatchChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const name: string = e.currentTarget.getAttribute('name') || '';
      const matchIndex = parseInt(
        e.currentTarget.getAttribute('data-index') || '',
        10,
      );
      if (name === '' || isNaN(matchIndex)) {
        return;
      }
      const value = e.currentTarget.value;
      const matches = data.match || [];
      if (name === 'term') {
        matches[matchIndex].term = value;
      } else if (name === 'eq') {
        matches[matchIndex].eq = value;
      }
      onChange(
        {
          ...data,
          match: [...matches],
        },
        index,
      );
    },
    [onChange, data, index],
  );

  const handleMatchRemove = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const matchIndex = parseInt(
        e.currentTarget.getAttribute('data-index') || '',
        10,
      );
      if (isNaN(matchIndex)) {
        return;
      }
      const matches = data.match || [];
      matches.splice(matchIndex, 1);
      onChange(
        {
          ...data,
          match: [...matches],
        },
        index,
      );
    },
    [onChange, data, index],
  );

  const handleAddURLRule = React.useCallback(() => {
    onChange(
      {
        ...data,
        match: [...(data?.match ?? []), { term: '', eq: '' }],
      },
      index,
    );
  }, [onChange, data, index]);

  return (
    <form className="f36-margin-bottom--xl variant">
      <IconButton
        buttonType="muted"
        className="delete-variant"
        disabled={false}
        iconProps={{
          icon: 'Delete',
        }}
        label="Delete"
        testId="deleteVariant"
        withDropdown={false}
        data-index={index}
        onClick={handleDelete}
      />
      <Grid
        className="f36-margin-top--m"
        columnGap="spacingXs"
        columns={2}
        flow="row"
        rowGap="spacingXs"
        rows={1}
      >
        <Grid
          className="f36-margin-top--m"
          columnGap="spacingXs"
          columns={2}
          flow="row"
          rowGap="spacingXs"
          rows={1}
        >
          <TextField
            id="name"
            labelText="Name"
            name="name"
            required={true}
            value={data.name}
            onChange={handleChange}
            width="full"
          />
          <SelectField
            labelText="Backend"
            id="backend"
            name="backend"
            required={true}
            value={data.backend || ''}
            onChange={handleChange}
            selectProps={{
              isDisabled: false,
              width: 'full',
            }}
          >
            <Option value={''}> </Option>
            {BACKENDS.map((backend) => (
              <Option key={backend} value={backend}>
                {backend}
              </Option>
            ))}
          </SelectField>
        </Grid>
        <VariantTraffic
          value={data.traffic}
          isLocked={data.lockTraffic}
          onChange={handleBalanceTraffic}
          onToggleLock={handleToggleLock}
        />
      </Grid>

      <VariantPage onChange={onChange} index={index} data={data} sdk={sdk} />

      {(data?.match ?? []).map((match, i) => (
        <VariantMatch
          key={i}
          match={match}
          index={i}
          onChange={handleMatchChange}
          onRemove={handleMatchRemove}
        />
      ))}
      <TextLink
        className="f36-margin-top--m"
        disabled={false}
        icon="Plus"
        iconPosition="left"
        linkType="primary"
        onClick={handleAddURLRule}
      >
        Add URL Rule
      </TextLink>
    </form>
  );
};
