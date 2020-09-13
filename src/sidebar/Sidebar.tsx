import React from "react";
import { SidebarExtensionSDK } from "contentful-ui-extensions-sdk";
import { DeepClone } from "./DeepClone";

const COMPONENTS = [DeepClone];

export const Sidebar: React.FC<{ sdk: SidebarExtensionSDK }> = ({ sdk }) => {
  return (
    <>
      {COMPONENTS.map((Component, i) => (
        <Component key={i} sdk={sdk} />
      ))}
    </>
  );
};
