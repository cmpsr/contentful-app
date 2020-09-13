import React from "react";
import {
  Select,
  Option,
  HelpText,
  FormLabel,
} from "@contentful/forma-36-react-components";
import { ContentTypeField } from "contentful-ui-extensions-sdk";
import { IEntryField } from "../../config";

export const EntryFieldSelect: React.FC<{
  entryField: IEntryField;
  contentTypeFields: ContentTypeField[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}> = ({ contentTypeFields, value, entryField, onChange }) => {
  const matchingContentTypeFields = React.useMemo(() => {
    console.log(contentTypeFields);
    return contentTypeFields.filter((f) => f.type === entryField.type);
  }, [contentTypeFields, entryField]);

  return (
    <div className="f36-margin-top--m">
      <FormLabel htmlFor={entryField.key}>{entryField.label}</FormLabel>
      <Select
        name={entryField.key}
        willBlurOnEsc={true}
        value={value}
        data-parameter={entryField.key}
        onChange={onChange}
      >
        <Option value="">None</Option>
        {matchingContentTypeFields.map(({ id, name }) => (
          <Option key={id} value={id}>
            {name}
          </Option>
        ))}
      </Select>
      <HelpText>{entryField.description}</HelpText>
    </div>
  );
};
