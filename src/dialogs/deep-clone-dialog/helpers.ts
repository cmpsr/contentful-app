import { Snapshot } from "recoil";
import { DialogExtensionSDK } from "contentful-ui-extensions-sdk";
import { Entry, DEFAULT_LOCAL, ITree } from "./types";
import { copyState } from "./copy-state";

const APPEND_TEXT_SEPARATOR = ": ";

export const deepClone = async (
  sdk: DialogExtensionSDK,
  sysId: string,
  options: { appendText: string; snapshot: Snapshot }
): Promise<Entry> => {
  const entryToClone = await sdk.space.getEntry<Entry>(sysId);
  const fields = { ...entryToClone.fields };
  const keys = Object.keys(fields);
  for (const fieldId of keys) {
    const field = fields[fieldId];
    if (field?.[DEFAULT_LOCAL]?.sys?.type === "Link") {
      const id = field[DEFAULT_LOCAL].sys.id;
      if (
        field[DEFAULT_LOCAL].sys.linkType === "Entry" &&
        id &&
        options.snapshot.getLoadable(
          // check if its checked
          copyState(id)
        ).contents
      ) {
        const clonedLinkEntry = await deepClone(sdk, id, options);
        field[DEFAULT_LOCAL].sys.id = clonedLinkEntry.sys.id;
      }
    } else if (fieldId === "id") {
      field[DEFAULT_LOCAL] = (field[DEFAULT_LOCAL] +
        APPEND_TEXT_SEPARATOR +
        options.appendText) as any;
    }
  }
  return await sdk.space.createEntry(entryToClone.sys.contentType.sys.id, {
    fields,
  });
};

export const fetchReferences = async (
  sdk: DialogExtensionSDK,
  sysId: string
): Promise<ITree> => {
  const referenceEntry = await sdk.space.getEntry<Entry>(sysId);
  const tree: ITree = {
    entry: referenceEntry,
    children: [],
  };

  const fields = referenceEntry.fields;
  const keys = Object.keys(fields);
  for (const fieldId of keys) {
    const field = fields[fieldId];
    if (field?.[DEFAULT_LOCAL]?.sys?.type === "Link") {
      const id = field[DEFAULT_LOCAL].sys.id;
      if (field[DEFAULT_LOCAL].sys.linkType === "Entry" && id) {
        tree.children.push(await fetchReferences(sdk, id));
      }
    }
  }
  return tree;
};
