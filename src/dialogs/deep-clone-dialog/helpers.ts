import { Snapshot } from "recoil";
import { DialogExtensionSDK } from "contentful-ui-extensions-sdk";
import { Entry, DEFAULT_LOCALE, ITree, Cache } from "./types";
import { copyState, createCopyStateKey } from "./copy-state";
import cloneDeep from "lodash.clonedeep";

const APPEND_TEXT_SEPARATOR = ": ";

export const deepClone = async (
  sdk: DialogExtensionSDK,
  cache: Cache,
  sysId: string,
  options: { appendText: string; snapshot: Snapshot },
  path: number[] = []
): Promise<Entry> => {
  const entryToClone: Entry = cache[sysId];
  if (!entryToClone) {
    throw new Error(`Unfetched entry: ${sysId}`);
  }

  const fields = cloneDeep(entryToClone.fields);
  const keys = Object.keys(fields);
  const ids: string[] = []; // We need to match which one is checked since they can be not unique
  for (const fieldId of keys) {
    const field = fields[fieldId];
    const locale = field[DEFAULT_LOCALE];
    if (Array.isArray(locale)) {
      for (const listItemIndex in locale) {
        const listItem = locale[listItemIndex];
        if (listItem?.sys?.type === "Link") {
          const id = listItem.sys.id;
          const newPath = [...path, ids.length];
          if (listItem.sys.linkType === "Entry" && id) {
            if (
              options.snapshot.getLoadable(
                // check if its checked
                copyState(createCopyStateKey(newPath, id))
              ).contents
            ) {
              const clonedLinkEntry = await deepClone(
                sdk,
                cache,
                id,
                options,
                newPath
              );
              locale[listItemIndex].sys.id = clonedLinkEntry.sys.id;
              cache[clonedLinkEntry.sys.id] = clonedLinkEntry;
            }
            ids.push(id);
          }
        }
      }
    } else if (locale?.sys?.type === "Link") {
      const id = locale.sys.id;
      if (locale.sys.linkType === "Entry" && id) {
        const newPath = [...path, ids.length];
        if (
          options.snapshot.getLoadable(
            // check if its checked
            copyState(createCopyStateKey(newPath, id))
          ).contents
        ) {
          const clonedLinkEntry = await deepClone(
            sdk,
            cache,
            id,
            options,
            newPath
          );
          locale.sys.id = clonedLinkEntry.sys.id;
          cache[clonedLinkEntry.sys.id] = clonedLinkEntry;
        }
        ids.push(id);
      }
    } else if (fieldId === "title" || (!fields["title"] && fieldId === "id")) {
      field[DEFAULT_LOCALE] = (field[DEFAULT_LOCALE] +
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
  sysId: string,
  options: { cache?: Cache } = {}
): Promise<ITree> => {
  options.cache = options.cache || {};

  let referenceEntry: Entry;
  if (options.cache[sysId]) {
    referenceEntry = options.cache[sysId];
  } else {
    referenceEntry = await sdk.space.getEntry<Entry>(sysId);
    options.cache[sysId] = referenceEntry;
  }

  const tree: ITree = {
    entry: referenceEntry,
    children: [],
    entryCache: options.cache || {},
  };

  const fields = referenceEntry.fields;
  const keys = Object.keys(fields);
  const ids: string[] = [];
  for (const fieldId of keys) {
    const locale = fields[fieldId][DEFAULT_LOCALE];
    if (Array.isArray(locale)) {
      for (const listItem of locale) {
        if (listItem?.sys?.type === "Link") {
          const id = listItem.sys.id;
          if (listItem.sys.linkType === "Entry" && id) {
            ids.push(id);
          }
        }
      }
    } else if (locale?.sys?.type === "Link") {
      const id = locale.sys.id;
      if (locale.sys.linkType === "Entry" && id) {
        ids.push(id);
      }
    }
  }

  const nonCachedIds = ids.filter((id) => !options.cache?.[id]);
  if (nonCachedIds.length) {
    const entries = await sdk.space.getEntries<Entry, { "sys.id[in]": string }>(
      {
        "sys.id[in]": nonCachedIds.join(","),
      }
    );
    entries.items.forEach((item) => {
      if (options.cache) {
        options.cache[item.sys.id] = item;
      }
    });
  }

  for (const id of ids) {
    tree.children.push(await fetchReferences(sdk, id, options));
  }

  return tree;
};
