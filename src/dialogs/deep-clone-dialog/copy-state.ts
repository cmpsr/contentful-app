import { atomFamily } from "recoil";

export const createCopyStateKey = (path: number[], sysId: string) => {
  return `${path.join("-")}-${sysId}`;
};

export const copyState = atomFamily({
  key: "EntryReferenceCopy",
  default: true,
});
