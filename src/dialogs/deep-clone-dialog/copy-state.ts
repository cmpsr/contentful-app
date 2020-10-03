import { atomFamily } from "recoil";

export const createCopyStateKey = (
  depth: number,
  index: number,
  sysId: string
) => {
  return `${depth}-${index}-${sysId}`;
};

export const copyState = atomFamily({
  key: "EntryReferenceCopy",
  default: true,
});
