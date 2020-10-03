import { DeepCloneDialog } from "./deep-clone-dialog";
import { IDialogFC } from "./types";

const dialogDictionary: {
  [id: string]: IDialogFC<any>;
} = {
  [DeepCloneDialog.dialogId]: DeepCloneDialog,
};

export { DeepCloneDialog, dialogDictionary };
