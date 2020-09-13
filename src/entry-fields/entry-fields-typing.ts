import { FieldExtensionSDK } from "contentful-ui-extensions-sdk";
import { IEntryField } from "../config";

export interface IEntryFieldProps {
  sdk: FieldExtensionSDK;
  config: IEntryField;
}
