import React from "react";
import {
  List,
  ListItem,
  Card,
  Paragraph,
  Checkbox,
} from "@contentful/forma-36-react-components";
import { useRecoilState } from "recoil";
import { copyState, createCopyStateKey } from "./copy-state";
import { DEFAULT_LOCALE, ITree } from "./types";

const Reference: React.FC<{
  tree: ITree;
  disabled: boolean;
  path?: number[];
}> = ({ tree, disabled, path = [] }) => {
  const [checked, setChecked] = useRecoilState(
    copyState(createCopyStateKey(path, tree.entry.sys.id))
  );
  return (
    <ListItem className="list-style-none">
      <Card className="reference-card">
        <Checkbox
          disabled={disabled}
          labelText="Clone?"
          name="should-clone"
          required={false}
          testId="ctf-ui-checkbox"
          type="checkbox"
          checked={checked}
          onChange={() => setChecked((c) => !c)}
        />
        <Paragraph className="f36-padding-left--xs">
          {tree.entry.fields?.title?.[DEFAULT_LOCALE] || tree.entry.fields?.id?.[DEFAULT_LOCALE]}
        </Paragraph>
      </Card>
      {tree.children.length > 0 && (
        <List>
          {tree.children.map((child, i) => (
            <Reference
              key={i}
              tree={child}
              disabled={disabled || !checked}
              path={[...path, i]}
            />
          ))}
        </List>
      )}
    </ListItem>
  );
};

export { Reference };
