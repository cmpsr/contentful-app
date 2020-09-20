import React from "react";
import { List } from "@contentful/forma-36-react-components";
import { ITree } from "./types";
import { Reference } from "./reference";
import { TreeSkeleton } from "./tree-skeleton";

const ReferenceTree: React.FC<{
  tree?: ITree;
  disabled: boolean;
  isLoading: boolean;
}> = ({ tree, disabled, isLoading }) => {
  if (isLoading || !tree) {
    return <TreeSkeleton />;
  }
  return (
    <List className="reference-tree">
      {tree.children.map((child, i) => (
        <Reference key={i} tree={child} disabled={disabled} />
      ))}
    </List>
  );
};

export { ReferenceTree };
