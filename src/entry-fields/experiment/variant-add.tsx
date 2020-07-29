import React from 'react';
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import { IVariantData } from './variant';
import { Button } from '@contentful/forma-36-react-components';

export interface IVariantAddProps {
  onAdd: (data: IVariantData) => void;
  sdk: FieldExtensionSDK;
  isFirst: boolean;
}

export const VariantAdd: React.FC<IVariantAddProps> = ({ sdk, onAdd, isFirst }) => {
  const handleAdd = React.useCallback(() => {
    onAdd({
      name: 'My Test',
      traffic: isFirst ? 1 : 0,
      lockTraffic: false,
    });
  }, [isFirst, onAdd]);

  return (
    <Button
      buttonType="primary"
      className=""
      disabled={false}
      href=""
      icon="PlusCircle"
      indicateDropdown={false}
      isFullWidth={false}
      loading={false}
      onClick={handleAdd}
      size={undefined}
      testId="cf-ui-button"
      type="button"
    >
      Add Variant
    </Button>
  );
};
