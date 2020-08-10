import React from 'react';
import { Variant, IVariantData } from './variant';
import { VariantAdd } from './variant-add';
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import { FormLabel } from '@contentful/forma-36-react-components';

interface ITrafficData {
  boundedTrafficVariants: IVariantData[];
  total: number;
  offset: number;
  totalFromAdjustableTests: number; // Count of non-locked traffic, not including one changed
  adjustableTestsCount: number;
}

const between0and100AndTruncate = (value: number) => {
  return Math.floor(Math.max(0, Math.min(100, value)));
}

const getTrafficTotals = (
  variants: IVariantData[],
  indexThatIsBeingChanged?: number,
  callback?: (totals: ITrafficData) => void,
): ITrafficData => {
  let results = variants.reduce<ITrafficData>(
    (accumulator, currentValue, i) => {
      // make sure its within range
      const traffic = between0and100AndTruncate(currentValue.traffic || 0);
      accumulator.boundedTrafficVariants[i].traffic = traffic;
      accumulator.total = accumulator.total + traffic;
      if (i !== indexThatIsBeingChanged && !currentValue.lockTraffic) {
        accumulator.totalFromAdjustableTests =
          accumulator.totalFromAdjustableTests + traffic;
        accumulator.adjustableTestsCount = accumulator.adjustableTestsCount + 1;
      }
      return accumulator;
    },
    {
      boundedTrafficVariants: [...variants],
      total: 0,
      offset: 0,
      totalFromAdjustableTests: 0,
      adjustableTestsCount: 0,
    },
  );
  results = {
    ...results,
    offset: 100 - results.total,
  }
  if (callback) {
    callback(results);
  }
  return results;
};
interface IVariantsProps {
  variants: IVariantData[];
  onChange: (variants: IVariantData[]) => void;
  sdk: FieldExtensionSDK;
}

export const Variants: React.FC<IVariantsProps> = ({
  variants,
  onChange,
  sdk,
}) => {
  const handleSetVariant = (variant: IVariantData, index?: number) => {
    const updatedVariants = [...variants];
    if (index !== undefined) {
      updatedVariants[index] = variant;
    } else {
      updatedVariants.push(variant);
    }
    onChange(updatedVariants);
  };

  const handleSetTrafficAcrossVariants = (
    allocation: number,
    index: number,
  ) => {
    let updatedVariants = [...variants];
    updatedVariants[index].traffic = between0and100AndTruncate(allocation);

    let { adjustableTestsCount, boundedTrafficVariants, offset: remainingOffset } = getTrafficTotals(
      updatedVariants,
      index,
    );
    updatedVariants = boundedTrafficVariants;
    // Try and fill remainder
    if (adjustableTestsCount) {

      const increment = remainingOffset < 0 ? -1 : 1;
      const moveable = updatedVariants.filter((v, i) => !v.lockTraffic && i !== index);
      const start = Math.floor(Math.random() * 100) % adjustableTestsCount;
      let counter = 0;
      while (remainingOffset !== 0 || moveable.length === 0) {
        const index = (counter + start) % adjustableTestsCount;
        const currentValue = moveable[index];
        if ((increment === 1 && currentValue.traffic < 100) || (increment === -1 && currentValue.traffic > 0)) {
          currentValue.traffic += increment;
          remainingOffset -= increment;
        }
        if (currentValue.traffic >= 100 && currentValue.traffic <= 0) {
          moveable.splice(index, 1); // Remove the full value
        } else {
          counter++;
        }
      }
    }

    const { offset } = getTrafficTotals(updatedVariants, index);
    if (offset !== 0) {
      updatedVariants[index].traffic = updatedVariants[index].traffic + offset;
    }

    onChange(updatedVariants);
  };

  const handleDelete = (index: number) => {
    const updatedVariants = [...variants];
    updatedVariants.splice(index, 1);

    // Try and fill remainding traffic
    for (let i = 0; i < updatedVariants.length; i++) {
      const currentValue = updatedVariants[i];
      if (i !== index && !currentValue.lockTraffic) {
        const { offset } = getTrafficTotals(updatedVariants, index);
        if (offset === 0) {
          break;
        }
        currentValue.traffic = between0and100AndTruncate(
          currentValue.traffic + offset,
        );
      }
    }

    onChange(updatedVariants);
  };

  const { totalFromAdjustableTests: wiggleRoom } = getTrafficTotals(variants);

  return (
    <>
      <FormLabel htmlFor="">Variants</FormLabel>
      {(variants ?? []).map((variant, index) => (
        <Variant
          key={index}
          data={variant}
          onChange={handleSetVariant}
          onBalanceTraffic={handleSetTrafficAcrossVariants}
          onDelete={handleDelete}
          sdk={sdk}
          index={index}
          wiggleRoom={wiggleRoom}
        />
      ))}
      <VariantAdd onAdd={handleSetVariant} sdk={sdk} isFirst={(variants ?? []).length === 0} />
    </>
  );
};
