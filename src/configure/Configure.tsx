import React from "react";
import {
  Heading,
  Paragraph,
  Form,
  Card,
  Workbench,
} from "@contentful/forma-36-react-components";
import { ContentType, AppExtensionSDK } from "contentful-ui-extensions-sdk";
import { EnhancedContentType } from "./components";
import config from "../config";

export const Configure: React.FC<{ sdk: AppExtensionSDK }> = ({ sdk }) => {
  const [parameters, setParameters] = React.useState<{ [attr: string]: any }>(
    {}
  );

  const [contentTypes, setContentTypes] = React.useState<Array<ContentType>>(
    []
  );

  // const createContainer = React.useCallback(async (id: ContainerIds) => {
  //   const container = await sdk.space.createContentType(CONTAINERS[id]);
  //   await sdk.space.updateContentType(container);
  // }, []);

  const onConfigure = React.useRef<any>();
  onConfigure.current = React.useCallback(async () => {
    const { items: contentTypes } = await sdk.space.getContentTypes();
    const contentTypeIds = (contentTypes as ContentType[]).map(
      (ct) => ct.sys.id
    );

    const targetState: any = {
      EditorInterface: contentTypeIds.reduce((acc, id) => {
        return { ...acc, [id]: { sidebar: { position: 0 } } };
      }, {}),
    };

    if (parameters.heroContentType && parameters.heroContentTypeField1) {
      targetState.EditorInterface[parameters.heroContentType] = {
        sidebar: { position: 0 },
        controls: [
          {
            fieldId: parameters.heroContentTypeField1,
          },
        ],
      };
    }

    return {
      parameters,
      targetState,
    };
  }, [parameters, sdk.space]);

  React.useEffect(() => {
    sdk.app.onConfigure(() => onConfigure.current());
    const getCurrentParameters = async () => {
      const params = await sdk.app.getParameters();
      setParameters(params || {});
      const { items } = await sdk.space.getContentTypes();
      setContentTypes(items as ContentType[]);
      sdk.app.setReady();
    };
    getCurrentParameters();
  }, [sdk]);

  const handleSetParameter = React.useCallback((key: string, value: Object) => {
    setParameters((params) => {
      return {
        ...params,
        [key]: value,
      };
    });
  }, []);

  return (
    <Workbench className="greyBg">
      <Workbench.Content type="text">
        <Form>
          <Card padding="large">
            <Heading element="h3" className="header">
              Hello World app
            </Heading>
            <Paragraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur
            </Paragraph>
          </Card>
          {config.enhancedContentTypes.map((enhancedContentType) => (
            <EnhancedContentType
              key={enhancedContentType.key}
              enhancedContentType={enhancedContentType}
              contentTypes={contentTypes}
              onChange={handleSetParameter}
              param={parameters[enhancedContentType.key]}
            />
          ))}
        </Form>
      </Workbench.Content>
    </Workbench>
  );
};
