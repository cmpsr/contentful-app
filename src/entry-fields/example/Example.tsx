import React from 'react';
import { IEntryFieldProps } from '../entry-fields-typing';

export const Example: React.FC<IEntryFieldProps> = ({ sdk }) => {
  return <div>Hello, I am {sdk.field.id}</div>;
};
