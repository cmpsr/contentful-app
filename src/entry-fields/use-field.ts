import { FieldExtensionSDK } from "contentful-ui-extensions-sdk";
import React from "react";

export const useField = <T = string>(
  sdk: FieldExtensionSDK
): [T, (val: T) => void] => {
  const [value, setValue] = React.useState<T>(
    (sdk.field.getValue() || {}) as T
  );

  const handleChange = React.useCallback(
    (v: T) => {
      setValue(v);
      if (v) {
        sdk.field.setValue(v);
      } else {
        sdk.field.removeValue();
      }
    },
    [sdk.field]
  );

  React.useEffect(() => {
    const detachValueChangeHandler = sdk.field.onValueChanged(setValue);
    return detachValueChangeHandler as () => void;
  }, [sdk.field]);

  return [value, handleChange];
};
