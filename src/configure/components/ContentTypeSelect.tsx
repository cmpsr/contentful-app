import React from 'react';
import {
  Select,
  Option,
  FormLabel,
  Note,
} from '@contentful/forma-36-react-components';
import { ContentType } from 'contentful-ui-extensions-sdk';

export const ContentTypeSelect: React.FC<{
  id: string;
  contentTypes: ContentType[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}> = ({ contentTypes, value, id, onChange }) => {
  return (
    <>
      <FormLabel htmlFor={id}>Content Type</FormLabel>
      <Select
        id={id}
        name={id}
        willBlurOnEsc={true}
        value={value}
        data-parameter={id}
        onChange={onChange}
      >
        <Option value="">None</Option>
        {contentTypes.map(({ sys, name }) => (
          <Option key={sys.id} value={sys.id}>
            {name}
          </Option>
        ))}
      </Select>
      {!value && (
        <Note noteType="primary" className="f36-margin-top--s">
          Please choose a content type from ones available in this space. If you
          have not created a content type to bind to, please do so now. Once you
          choose a content type, you will see additional options.
        </Note>
      )}
    </>
  );
};
