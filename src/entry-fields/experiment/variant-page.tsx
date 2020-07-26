import React from 'react';
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import { IVariantData } from './variant';
import {
  TextLink,
  Card,
  EntryCard,
  DropdownList,
  DropdownListItem,
} from '@contentful/forma-36-react-components';

enum LinkState {
  Hidden,
  Unlinked,
  Linked,
}

enum EntryStatus {
  Draft = 'draft',
  Published = 'published',
  Archived = 'archived',
}

export interface IVariantAddProps {
  onChange: (data: IVariantData, index: number) => void;
  data: IVariantData;
  sdk: FieldExtensionSDK;
  index: number;
}

export const VariantPage: React.FC<IVariantAddProps> = ({
  sdk,
  data,
  onChange,
  index,
}) => {
  let status: LinkState;
  if (data.id) {
    status = LinkState.Linked;
  } else if (data.backend === 'backend-1') {
    status = LinkState.Unlinked;
  } else {
    status = LinkState.Hidden;
  }

  const [entry, setEntry] = React.useState<any>(undefined);
  const [loadingError, setLoadingError] = React.useState<any>(undefined);

  React.useEffect(() => {
    const loadEntry = async () => {
      if (data.id) {
        try {
          const result = await sdk.space.getEntry(data.id);
          setEntry(result);
        } catch (e) {
          setLoadingError(e);
        }
      }
    };
    loadEntry();
    return () => {
      setEntry(undefined);
      setLoadingError(undefined);
    };
  }, [sdk, data.id]);

  let entryStatus: string = EntryStatus.Draft;
  if (entry?.sys.publishedAt) {
    entryStatus = EntryStatus.Published;
  } else if (loadingError) {
    entryStatus = EntryStatus.Archived; // assume its archived
  }

  const link = React.useCallback(
    (entry: any) => {
      if (entry) {
        // if user selects an entry, create a variant
        const {
          sys: { id },
        } = entry as any;
        onChange(
          {
            ...data,
            id,
          },
          index,
        );
      }
    },
    [onChange, index, data],
  );

  const handleClear = React.useCallback(() => {
    const newData = {
      ...data,
    };
    delete newData.id;
    onChange(newData, index);
  }, [onChange, index, data]);

  const handleLink = React.useCallback(async () => {
    link(
      await sdk.dialogs.selectSingleEntry({
        contentTypes: ['standardPage'],
      }),
    );
  }, [sdk, link]);

  const handleCreate = React.useCallback(async () => {
    const { entity } = (await sdk.navigator.openNewEntry('standardPage', {
      slideIn: true,
    })) as any;
    link(entity);
  }, [sdk, link]);

  if (status === LinkState.Hidden) {
    return null;
  }

  return (
    <div className="f36-margin-top--m">
      {status === LinkState.Unlinked && (
        <Card className="" padding="default" testId="link-page">
          <TextLink
            className="f36-margin-right--xl"
            disabled={false}
            icon="Plus"
            iconPosition="left"
            linkType="primary"
            onClick={handleCreate}
          >
            Add new Standard Page and link
          </TextLink>
          <TextLink
            className=""
            disabled={false}
            icon="Link"
            iconPosition="left"
            linkType="primary"
            onClick={handleLink}
          >
            Link existing entry
          </TextLink>
        </Card>
      )}
      {status === LinkState.Linked && (
        <EntryCard
          testId="page-card"
          title={entry?.fields?.id?.['en-US']}
          status={entryStatus as any}
          contentType="Contentful Standard Page"
          loading={!entry && !loadingError}
          size="small"
          dropdownListElements={
            <DropdownList>
              <DropdownListItem onClick={handleLink}>Edit</DropdownListItem>
              <DropdownListItem onClick={handleClear}>Clear</DropdownListItem>
            </DropdownList>
          }
        />
      )}
    </div>
  );
};
