import React from "react";
export interface IDialogFC<T> extends React.FC<T> {
  dialogId: string;
}
