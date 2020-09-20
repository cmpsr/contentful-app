import React from "react";
import {
  Note,
  Button,
  TextField,
  FormLabel,
} from "@contentful/forma-36-react-components";
import { DialogExtensionSDK } from "contentful-ui-extensions-sdk";
import { IDialogFC } from "../types";
import { useRecoilCallback } from "recoil";
import { deepClone, fetchReferences } from "./helpers";
import { ITree } from "./types";
import { ReferenceTree } from "./reference-tree";

import "./deep-clone-dialog.css";

const DeepCloneDialog: IDialogFC<{
  sdk: DialogExtensionSDK;
  entryReferenceId: string;
}> = ({ sdk, entryReferenceId }) => {
  const [isLoadingReferences, setIsLoadingReferences] = React.useState(true);
  const [isCloning, setIsCloning] = React.useState(false);
  const [appendText, setAppendText] = React.useState("Copy");

  const [error, setError] = React.useState<Error>();
  const [referenceTree, setReferenceTree] = React.useState<ITree>();

  const handleAppendTextChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAppendText(e.currentTarget.value);
    },
    []
  );

  const handleDeepClone = useRecoilCallback(
    ({ snapshot }) => async () => {
      setIsCloning(true);
      try {
        const newEntry = await deepClone(sdk, entryReferenceId, {
          appendText,
          snapshot,
        });
        sdk.close(newEntry);
      } catch (e) {
        setError(e.message);
      }
      setIsCloning(false);
    },
    [sdk, appendText, entryReferenceId]
  );

  React.useEffect(() => {
    const fetchReferenceTree = async () => {
      try {
        const references = await fetchReferences(sdk, entryReferenceId);
        setReferenceTree(references);
      } catch (e) {
        setError(e.message);
      }
      setIsLoadingReferences(false);
    };
    fetchReferenceTree();
  }, [sdk, entryReferenceId]);

  let content;
  if (isLoadingReferences || referenceTree) {
    content = (
      <div className="tree-container">
        <div className="scrollable-container">
          {error && (
            <Note
              noteType="negative"
              testId="cf-ui-note"
              className="f36-margin-bottom--l"
            >
              {error}
            </Note>
          )}
          <TextField
            // Save vertical space by not having helpText
            // helpText="Value appended to cloned entry titles"
            id="appendText"
            labelText="Append Text"
            name="appendText"
            required={false}
            testId="cf-ui-text-field"
            value={appendText}
            width="full"
            onChange={handleAppendTextChange}
            textInputProps={{ disabled: isCloning }}
          />
          <FormLabel htmlFor="references" className="f36-margin-top--l">
            Entry References to Clone
          </FormLabel>

          <ReferenceTree
            isLoading={isLoadingReferences}
            tree={referenceTree}
            disabled={isCloning}
          />
        </div>

        <div className="dialog-actions f36-margin-top--l">
          <Button
            className="submit"
            buttonType="primary"
            isFullWidth={false}
            loading={isCloning || isLoadingReferences}
            testId="cf-ui-button"
            type="button"
            onClick={handleDeepClone}
            disabled={isCloning || isLoadingReferences}
          >
            Deep Clone
          </Button>
        </div>
      </div>
    );
  } else {
    content = (
      <Note noteType="negative" testId="cf-ui-note">
        {error || "Unknow error has occured"}
      </Note>
    );
  }
  return (
    <div className="f36-padding-horizontal--xl f36-padding-vertical--l">
      {content}
    </div>
  );
};

DeepCloneDialog.dialogId = "DEEP_CLONE_DIALOG";

export { DeepCloneDialog };
