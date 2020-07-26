import React from 'react';
import { IEntryFieldProps } from '../entry-fields-typing';
import { useField } from '../use-field';
import { IVariantData } from './variant';
import { Variants } from './variants';
import { TrafficAllocationTextField } from './traffic-allocation-text-field';

interface IExperimentData {
  allocation?: number;
  variants: IVariantData[];
}

export const Experiment: React.FC<IEntryFieldProps> = ({ sdk }) => {
  const [value, setValue] = useField<IExperimentData>(sdk);

  const handleVariantsChange = (variants: IVariantData[]) => {
    setValue({
      ...value,
      variants,
    });
  };

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
      <TrafficAllocationTextField
        value={value.allocation ?? 0}
        onChange={handleTextFieldChange}
      />
      <Variants
        variants={value.variants}
        onChange={handleVariantsChange}
        sdk={sdk}
      />
    </>
  );
};
