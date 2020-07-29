import React from 'react';
import { Variant, IVariantData } from './variant';
import { VariantAdd } from './variant-add';
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import { FormLabel } from '@contentful/forma-36-react-components';

interface ITrafficData {
  boundedTrafficVariants: IVariantData[];
  total: number;
  totalFromAdjustableTests: number; // Count of non-locked traffic, not including one changed
  adjustableTestsCount: number;
}

const between0and1AndTruncate = (value: number) =>
  Math.round(Math.max(0, Math.min(1, value)) * 100) / 100;

const getTrafficTotals = (
  variants: IVariantData[],
  indexThatIsBeingChanged: number,
  callback?: (totals: ITrafficData) => void,
): ITrafficData => {
  const results = variants.reduce<ITrafficData>(
    (accumulator, currentValue, i) => {
      // make sure its within range
      const traffic = between0and1AndTruncate(currentValue.traffic || 0);
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
      totalFromAdjustableTests: 0,
      adjustableTestsCount: 0,
    },
  );
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
    const newAllocation = between0and1AndTruncate(allocation);
    let updatedVariants = [...variants];
    const oldAllocation = updatedVariants[index].traffic;
    const allocationChange = newAllocation - oldAllocation;
    updatedVariants[index].traffic = newAllocation;

    const { adjustableTestsCount, boundedTrafficVariants } = getTrafficTotals(
      updatedVariants,
      index,
    );
    updatedVariants = boundedTrafficVariants;

    const moveRestBy = adjustableTestsCount
      ? allocationChange / adjustableTestsCount
      : 0;

    // Redistribute
    updatedVariants.forEach((currentValue, i) => {
      if (i !== index && !currentValue.lockTraffic) {
        const traffic = between0and1AndTruncate(
          currentValue.traffic - moveRestBy,
        );
        updatedVariants[i].traffic = traffic; // save changes
      }
    });

    // Try and fill remainder
    for (let i = 0; i < updatedVariants.length; i++) {
      const currentValue = updatedVariants[i];
      if (i !== index && !currentValue.lockTraffic) {
        const { total } = getTrafficTotals(updatedVariants, index);
        if (total === 1) {
          break;
        }
        const remainder = 1 - total;
        currentValue.traffic = between0and1AndTruncate(
          currentValue.traffic + remainder,
        );
      }
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
        const { total } = getTrafficTotals(updatedVariants, index);
        if (total === 1) {
          break;
        }
        const remainder = 1 - total;
        currentValue.traffic = between0and1AndTruncate(
          currentValue.traffic + remainder,
        );
      }
    }

    onChange(updatedVariants);
  };

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
        />
      ))}
      <VariantAdd onAdd={handleSetVariant} sdk={sdk} isFirst={(variants ?? []).length === 0} />
    </>
  );
};
