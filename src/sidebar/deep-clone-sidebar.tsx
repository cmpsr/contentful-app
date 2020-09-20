import React from "react";
import { Button } from "@contentful/forma-36-react-components";
import { SidebarExtensionSDK } from "contentful-ui-extensions-sdk";
import { DeepCloneDialog } from "../dialogs";

const DEFAULT_LOCAL = "en-US";
type Entry = {
  fields: {
    [id: string]: {
      [DEFAULT_LOCAL]: {
        sys: {
          id: string;
          linkType: string;
          type: string;
        };
      };
    };
  };
  sys: {
    id: string;
    contentType: {
      sys: {
        id: string;
      };
    };
  };
};

export const DeepCloneSidebar: React.FC<{ sdk: SidebarExtensionSDK }> = ({
  sdk,
}) => {
  const handleDeepClone = React.useCallback(() => {
    sdk.dialogs
      .openCurrent({
        id: DeepCloneDialog.dialogId, // you need this but cannot reference this in the location object
        title: "Deep Clone",
        width: 780,
        minHeight: 400,
        allowHeightOverflow: true,
        parameters: {
          entryReferenceId: sdk.entry.getSys().id,
          dialogId: DeepCloneDialog.dialogId,
        },
        shouldCloseOnEscapePress: true,
      })
      .then((entry: Entry) => {
        if (entry) {
          sdk.navigator.openEntry(entry.sys.id);
          sdk.notifier.success("Entry deep cloned");
        }
      });
  }, [sdk]);
  return (
    <Button
      buttonType="muted"
      icon="Copy"
      indicateDropdown={false}
      isFullWidth={true}
      onClick={handleDeepClone}
      testId="deep-clone"
      type="button"
    >
      Deep Clone
    </Button>
  );
};
