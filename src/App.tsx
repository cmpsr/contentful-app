import React from "react";
import {
  locations,
  KnownSDK,
  AppExtensionSDK,
  FieldExtensionSDK,
  SidebarExtensionSDK,
  DialogExtensionSDK,
} from "contentful-ui-extensions-sdk";
import { Configure } from "./configure";
import { Sidebar } from "./sidebar";
import { IEnhancedContentTypeParam } from "./configure/components";
import config from "./config";
import { dialogDictionary } from "./dialogs";

const App: React.FC<{ sdk: KnownSDK }> = ({ sdk }) => {
  React.useEffect(() => {
    (sdk as FieldExtensionSDK)?.window?.startAutoResizer();
  }, [sdk]);

  if (sdk.location.is(locations.LOCATION_APP_CONFIG)) {
    return <Configure sdk={sdk as AppExtensionSDK} />;
  } else if (sdk.location.is(locations.LOCATION_ENTRY_FIELD)) {
    const fieldSdk = sdk as FieldExtensionSDK;
    const enhancedContentType = config.enhancedContentTypes.find((ect) => {
      const param: IEnhancedContentTypeParam = (fieldSdk.parameters
        .installation as any)[ect.key];
      return fieldSdk.contentType.sys.id === param?.contentType;
    });
    if (enhancedContentType) {
      const param: IEnhancedContentTypeParam = (fieldSdk.parameters
        .installation as any)[enhancedContentType.key];
      const entryFieldConfig = enhancedContentType.entryFields.find(
        (entryField) => {
          return fieldSdk.field.id === param.entryFields[entryField.key];
        }
      );
      if (entryFieldConfig) {
        const Component = entryFieldConfig.Component;
        return <Component sdk={fieldSdk} config={entryFieldConfig} />;
      }
    }
  } else if (sdk.location.is(locations.LOCATION_ENTRY_SIDEBAR)) {
    const sidebarSdk = sdk as SidebarExtensionSDK;
    return <Sidebar sdk={sidebarSdk} />;
  } else if (sdk.location.is(locations.LOCATION_DIALOG)) {
    const dialogSdk = sdk as DialogExtensionSDK;
    const {
      dialogId,
      ...dialogProps
    }: {
      dialog: string;
      [propName: string]: any;
    } = (dialogSdk.parameters?.invocation ?? {}) as any;

    if (dialogId && dialogDictionary[dialogId]) {
      const Dialog = dialogDictionary[dialogId];
      return <Dialog sdk={dialogSdk} {...dialogProps} />;
    }
  }
  return <div>404</div>;
};

export default App;
