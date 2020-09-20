import { atomFamily } from "recoil";

export const copyState = atomFamily({
  key: "EntryReferenceCopy",
  default: true,
});
