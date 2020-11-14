import * as entryFields from './entry-fields';

export interface IEntryField {
  key: string;
  label: string;
  description: string;
  type: 'Object' | 'Symbol' | 'Text' | 'Array' | 'Link';
  Component: React.FC<entryFields.IEntryFieldProps>;
  data?: {
    [key: string]: string | number | boolean;
  };
}

export interface IEnhancedContentType {
  key: string;
  label: string;
  description: string;
  entryFields: IEntryField[];
}

export interface IConfig {
  enhancedContentTypes: IEnhancedContentType[];
}

const config: IConfig = {
  enhancedContentTypes: [
    {
      key: 'hero',
      label: 'Hero',
      description: 'Hero content type enables X Y and Z',
      entryFields: [
        {
          key: 'dropdown',
          label: 'Dropdown Type',
          description:
            'This field will allow you to do all kinds of cool things. Please make sure its of Object type.',
          type: 'Symbol',
          Component: entryFields.DropdownType,
          data: {
            type: 'hero',
          },
        },
      ],
    },
    {
      key: 'feature',
      label: 'Feature',
      description: 'Feature content type enables X Y and Z',
      entryFields: [
        {
          key: 'dropdown',
          label: 'Dropdown Type',
          description:
            'This field will allow you to do all kinds of cool things. Please make sure its of Object type.',
          type: 'Symbol',
          Component: entryFields.DropdownType,
          data: {
            type: 'feature',
          },
        },
      ],
    },
    {
      key: 'ab',
      label: 'A/B Testing',
      description: 'Composer allows for easy ab testing of your components',
      entryFields: [
        {
          key: 'experiment',
          label: 'Experiment',
          description:
            'Expermiment section allows you to configure how traffic is allocated to each of the variants',
          type: 'Object',
          Component: entryFields.Experiment,
          data: {
            type: 'ab',
          },
        },
      ],
    },
    {
      key: 'formsort',
      label: 'Formsort',
      description: 'Show a Formsort form in your app',
      entryFields: [
        {
          key: 'formsort',
          label: 'Formsort',
          description:
            'Add Formasort to your app\'s page',
          type: 'Object',
          Component: entryFields.Formsort,
          data: {
            type: 'formsort',
          },
        },
      ],
    },
  ],
};

export default config;
