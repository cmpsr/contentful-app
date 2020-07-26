import React from 'react';
import { render, screen } from '@testing-library/react';
import { Variants } from '../variants';
import { IVariantData } from '../variant';
jest.mock('../variant', () => {
  return {
    Variant: ({ index, data }: any) => (
      <div data-test-id={`variant-${index}`}>{data}</div>
    ),
  };
});

describe('Variants', () => {
  let sdk: any;
  let variants: IVariantData[];
  let handleChangeMock: jest.Mock<any>;
  beforeEach(() => {
    sdk = {};
    variants = ['hi' as any];
  });
  it('should render variants', async () => {
    render(
      <Variants
        sdk={sdk as any}
        onChange={handleChangeMock}
        variants={variants}
      />,
    );

    expect(screen.getByText('Variants')).toBeTruthy();
    expect(screen.getAllByTestId('variant-0')).toBeTruthy();
    expect(screen.getByText('hi')).toBeTruthy();
  });
});
