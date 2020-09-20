import React from "react";
import { SidebarExtensionSDK } from "contentful-ui-extensions-sdk";
import { DeepCloneSidebar } from "./deep-clone-sidebar";

const COMPONENTS = [DeepCloneSidebar];

export const Sidebar: React.FC<{ sdk: SidebarExtensionSDK }> = ({ sdk }) => {
  return (
    <>
      {COMPONENTS.map((Component, i) => (
        <Component key={i} sdk={sdk} />
      ))}
    </>
  );
};
