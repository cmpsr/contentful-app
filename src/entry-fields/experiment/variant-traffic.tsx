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
  wiggleRoom: number;
  onChange: (value: number) => void;
  onToggleLock: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const VariantTraffic: React.FC<IVariantTrafficProps> = ({
  value,
  isLocked,
  wiggleRoom,
  onChange,
  onToggleLock,
}) => {
  const [valueState, setValueState] = React.useState<undefined | number>();
  const stringValue: string = valueState === undefined ? value.toString() : valueState.toString();
  const wiggleRoomRef = React.useRef<number>(wiggleRoom);
  wiggleRoomRef.current = wiggleRoom;

  const sliderRef = React.useRef<HTMLInputElement>(null);
  const textRef = React.useRef<HTMLInputElement>(null);

  const [debounceChange] = useDebouncedCallback((updatedValue: number) => {
    onChange(Number(updatedValue));
  }, 60, { maxWait: 60 });

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.currentTarget.value;
      const num = Number(newValue);
      setValueState(num <= wiggleRoomRef.current ? num : wiggleRoomRef.current);
      debounceChange(num);
    },
    [debounceChange],
  );

  const handleMouseUp = React.useCallback(
    () => {
      setValueState(undefined);
    },
    [],
  );


  return (
    <div className="f36-margin-top--m f36-margin-right--xl f36-padding-right--xl">
      <div>
        <FormLabel htmlFor={TRAFFIC_FIELD_NAME} required={true}>
          Traffic Percentage
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
            max="100"
            step="1"
            onMouseUp={handleMouseUp}
            onChange={handleChange}
            style={{ width: '100%' }}
            ref={sliderRef}
            disabled={isLocked}
            value={stringValue}
          />
        </div>
        <div style={{ gridColumnStart: 'span 3' }}>
          <TextInput
            id="traffic"
            name={TRAFFIC_FIELD_NAME}
            required={true}
            onChange={handleChange}
            type="number"
            step={1}
            min={0}
            max={100}
            width="full"
            style={{ textAlign: 'right' }}
            inputRef={textRef}
            disabled={isLocked}
            value={stringValue}
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
