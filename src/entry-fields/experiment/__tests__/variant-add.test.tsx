import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { VariantAdd } from '../variant-add';

describe('variant add', () => {
  let sdk: any;
  beforeEach(() => {
    sdk = {};
  });
  it('should pull up new page dialog', async () => {
    const onAdd = jest.fn();
    render(<VariantAdd onAdd={onAdd} sdk={sdk as any} />);

    fireEvent.click(screen.getByText('Add Variant'));
    expect(onAdd).toBeCalled();
  });
});
