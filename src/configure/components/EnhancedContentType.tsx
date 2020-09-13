import React from "react";
import { IEnhancedContentType } from "../../config";
import {
  Card,
  Heading,
  Paragraph,
  FieldGroup,
} from "@contentful/forma-36-react-components";
import { ContentType } from "contentful-ui-extensions-sdk";
import { ContentTypeSelect } from "./ContentTypeSelect";
import { EntryFieldSelect } from "./EntryFieldSelect";

export interface IEnhancedContentTypeParam {
  contentType: string;
  entryFields: { [key: string]: string };
}

export const EnhancedContentType: React.FC<{
  enhancedContentType: IEnhancedContentType;
  contentTypes: ContentType[];
  param: IEnhancedContentTypeParam;
  onChange: (key: string, value: Object) => void;
}> = ({
  contentTypes,
  enhancedContentType,
  param = { contentType: "", entryFields: {} },
  onChange,
}) => {
  const handleSetField = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const attr = e.currentTarget.getAttribute("data-parameter");
      const value = e.currentTarget.value;
      if (!attr) {
        throw new Error("No attribute found");
      }

      onChange(enhancedContentType.key, {
        ...param,
        entryFields: {
          ...param.entryFields,
          [attr]: value,
        },
      });
    },
    [onChange, enhancedContentType.key, param]
  );

  const handleSetContentType = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.currentTarget.value;

      onChange(enhancedContentType.key, {
        ...param,
        contentType: value,
      });
    },
    [onChange, enhancedContentType.key, param]
  );

  const contentTypeFields = React.useMemo(() => {
    const contentType = contentTypes.find(
      ({ sys }) => sys.id === param.contentType
    );
    if (!contentType) {
      return [];
    }
    return contentType.fields;
  }, [param.contentType, contentTypes]);

  let entryFields;
  if (contentTypeFields.length) {
    entryFields = enhancedContentType.entryFields.map((entryField) => {
      return (
        <EntryFieldSelect
          key={entryField.key}
          entryField={entryField}
          value={param?.entryFields?.[entryField.key] ?? ""}
          contentTypeFields={contentTypeFields}
          onChange={handleSetField}
        />
      );
    });
  }

  return (
    <Card padding="large">
      <Heading element="h4" className="header">
        {enhancedContentType.label}
      </Heading>
      <Paragraph className="f36-margin-bottom--l">
        {enhancedContentType.description}
      </Paragraph>
      <FieldGroup>
        <ContentTypeSelect
          id={`${enhancedContentType.key}.contentType`}
          onChange={handleSetContentType}
          value={param.contentType || ""}
          contentTypes={contentTypes}
        />
        {entryFields}
      </FieldGroup>
    </Card>
  );
};
