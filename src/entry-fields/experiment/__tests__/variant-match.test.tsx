import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { VariantMatch } from '../variant-match';

describe('Variant Match', () => {
  it('should update and delete', async () => {
    const handleChangeMock = jest.fn();
    const handleRemoveMock = jest.fn();
    render(
      <VariantMatch
        index={0}
        onChange={handleChangeMock}
        onRemove={handleRemoveMock}
        match={{
          term: 'foo',
          eq: 'bar',
        }}
      />,
    );

    expect((screen.getByTestId('term-0') as HTMLInputElement).value).toBe(
      'foo',
    );
    expect((screen.getByTestId('eq-0') as HTMLInputElement).value).toBe('bar');
    expect(handleChangeMock).not.toBeCalled();

    fireEvent.change(screen.getByTestId('term-0'), {
      target: { value: 'updatedTerm' },
    });

    expect(handleChangeMock).toBeCalled();

    fireEvent.change(screen.getByTestId('eq-0'), {
      target: { value: 'updatedEq' },
    });

    expect(handleChangeMock).toBeCalledTimes(2);

    expect(handleRemoveMock).not.toBeCalled();
    fireEvent.click(screen.getByTestId('deleteMatch'));
    expect(handleRemoveMock).toBeCalled();
  });
});
