import React from 'react';
import {
  TextInput,
  FormLabel,
  IconButton,
} from '@contentful/forma-36-react-components';
import './variant-match.css';

export interface IMatch {
  term: string;
  eq: string;
}

export interface IVariantMatchProps {
  match: IMatch;
  index: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const VariantMatch: React.FC<IVariantMatchProps> = ({
  match,
  index,
  onChange,
  onRemove,
}) => {
  return (
    <div className="match">
      <div className="match-row">
        <FormLabel className="match-label match-label-pill" htmlFor="someInput">
          WHEN
        </FormLabel>
        <TextInput
          disabled={false}
          isReadOnly={false}
          required={false}
          value={match.term}
          width="full"
          willBlurOnEsc={true}
          withCopyButton={false}
          name="term"
          testId={`term-${index}`}
          data-index={index}
          onChange={onChange}
        />
        <div className="match-actions">
          <IconButton
            buttonType="muted"
            className=""
            disabled={false}
            iconProps={{
              icon: 'Delete',
            }}
            label="Delete"
            testId="deleteMatch"
            withDropdown={false}
            data-index={index}
            onClick={onRemove}
          />
        </div>
      </div>
      <div className="match-row">
        <FormLabel className="match-label" htmlFor="someInput">
          Is
        </FormLabel>
        <TextInput
          disabled={false}
          isReadOnly={false}
          required={false}
          name="eq"
          testId={`eq-${index}`}
          value={match.eq}
          width="full"
          willBlurOnEsc={true}
          withCopyButton={false}
          data-index={index}
          onChange={onChange}
        />
        <div className="match-actions" />
      </div>
    </div>
  );
};
