import React from 'react';
import {
  Button
} from '@contentful/forma-36-react-components';
import { SidebarExtensionSDK } from 'contentful-ui-extensions-sdk';

const DEFAULT_LOCAL = "en-US";
type Entry = {
  fields: {
    [id: string]: {
      [DEFAULT_LOCAL]: {
        sys: {
          id: string;
          linkType: string;
          type: string;
        }
      }
    }
  },
  sys: {
    id: string,
    contentType: {
      sys: {
        id: string;
      }
    }
  },
};

export const deepClone = async (sdk: SidebarExtensionSDK, sysId: string): Promise<Entry> => {
  const entryToClone = await sdk.space.getEntry<Entry>(sysId);
  const fields = {...entryToClone.fields};
  const keys = Object.keys(fields);
  for (const fieldId of keys) {
    const field = fields[fieldId];
    if (field?.[DEFAULT_LOCAL]?.sys?.type === "Link") {
      if (field[DEFAULT_LOCAL].sys.linkType === "Entry" && field[DEFAULT_LOCAL].sys.id) {
        const clonedLinkEntry = await deepClone(sdk, field[DEFAULT_LOCAL].sys.id);
        field[DEFAULT_LOCAL].sys.id = clonedLinkEntry.sys.id;
      }
    } else if (fieldId === "id") {
      field[DEFAULT_LOCAL] = (field[DEFAULT_LOCAL] + " Copy") as any;
    }
  }
  return await sdk.space.createEntry(entryToClone.sys.contentType.sys.id, {
    fields,
  });
}

export const DeepClone: React.FC<{ sdk: SidebarExtensionSDK }> = ({ sdk }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const handleDeepClone = React.useCallback(() => {
    const executeDeepClone = async () => {
      try {
        const newEntry = await deepClone(sdk, sdk.entry.getSys().id);
        sdk.navigator.openEntry(newEntry.sys.id);
        sdk.notifier.success("Entry deep cloned");
      } catch {
        sdk.notifier.error("Error cloning entry");
      }
      setIsLoading(false);
    };
    executeDeepClone();
    setIsLoading(true);

  }, [sdk]);
  return (
    <Button
      buttonType="muted"
      className=""
      disabled={isLoading}
      href=""
      icon="Copy"
      indicateDropdown={false}
      isFullWidth={true}
      // loading={isLoading}
      onClick={handleDeepClone}
      // size="large"
      testId="cf-ui-button"
      type="button"
    >
      Deep Clone
    </Button>
  );
};