import React from 'react';
import { IEntryFieldProps } from '../entry-fields-typing';
import { Items } from './data';
import { Dropdown } from './Dropdown';

export const DropdownType: React.FC<IEntryFieldProps> = ({ sdk, config }) => {
  const [value, setValue] = React.useState<string>(sdk.field.getValue() || '');
  const dropdownType = config?.data?.type as string;
  const items = (Items as any)[dropdownType];

  const handleChange = React.useCallback(
    (v: string) => {
      setValue(v);
      if (v) {
        sdk.field.setValue(v);
      } else {
        sdk.field.removeValue();
      }
    },
    [sdk.field],
  );

  React.useEffect(() => {
    const detachValueChangeHandler = sdk.field.onValueChanged(setValue);
    return detachValueChangeHandler as () => void;
  }, [sdk.field]);

  return (
    <Dropdown items={items} onChange={handleChange} valueSelected={value} />
  );
};
