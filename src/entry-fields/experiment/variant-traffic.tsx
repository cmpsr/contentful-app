import React from 'react';
import {
  IconButton,
  TextInput,
  FormLabel,
} from '@contentful/forma-36-react-components';
import { Grid } from '@contentful/forma-36-react-components/dist/components/Grid';
import { useDebouncedCallback } from 'use-debounce';

export const TRAFFIC_FIELD_NAME = 'traffic';

export interface IVariantTrafficProps {
  value: number;
  isLocked: boolean;
  onChange: (value: number) => void;
  onToggleLock: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const VariantTraffic: React.FC<IVariantTrafficProps> = ({
  value,
  isLocked,
  onChange,
  onToggleLock,
}) => {
  const stringValue = value.toString();

  const sliderRef = React.useRef<HTMLInputElement>(null);
  const textRef = React.useRef<HTMLInputElement>(null);

  const [debounceChange] = useDebouncedCallback((updatedValue: string) => {
    onChange(Number(updatedValue));
  }, 500);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.currentTarget.value;
      if (sliderRef.current) {
        sliderRef.current.value = newValue;
      }
      if (textRef.current) {
        textRef.current.value = newValue;
      }
      debounceChange(newValue);
    },
    [debounceChange],
  );

  React.useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.value = stringValue;
    }
    if (textRef.current) {
      textRef.current.value = stringValue;
    }
  }, [stringValue]);

  return (
    <div className="f36-margin-top--m f36-margin-right--xl f36-padding-right--xl">
      <div>
        <FormLabel htmlFor={TRAFFIC_FIELD_NAME} required={true}>
          Traffic
        </FormLabel>
      </div>
      <Grid
        columnGap="spacingXs"
        columns={12}
        flow="row"
        rowGap="spacingXs"
        rows={1}
      >
        <div style={{ gridColumnStart: 'span 8', padding: '.6rem 0 0' }}>
          <input
            type="range"
            name={TRAFFIC_FIELD_NAME}
            min="0"
            max="1"
            step="0.01"
            onChange={handleChange}
            style={{ width: '100%' }}
            ref={sliderRef}
          />
        </div>
        <div style={{ gridColumnStart: 'span 3' }}>
          <TextInput
            id="traffic"
            name={TRAFFIC_FIELD_NAME}
            required={true}
            onChange={handleChange}
            type="number"
            step={0.1}
            min={0}
            max={1}
            width="full"
            style={{ textAlign: 'right' }}
            inputRef={textRef}
          />
        </div>
        <div style={{ padding: '.6rem 0 0' }}>
          <IconButton
            buttonType={isLocked ? 'primary' : 'muted'}
            iconProps={{
              icon: 'Lock',
            }}
            label="Lock"
            onClick={onToggleLock}
          />
        </div>
      </Grid>
    </div>
  );
};
