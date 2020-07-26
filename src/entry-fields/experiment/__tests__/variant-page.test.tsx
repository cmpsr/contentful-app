import React from 'react';
import { render, screen } from '@testing-library/react';
import { VariantPage } from '../variant-page';
import { IVariantData } from '../variant';

describe('Variants', () => {
  const sdk: any = {
    space: {
      getEntry: jest.fn(),
    },
  };
  let handleChangeMock: jest.Mock<any>;

  it('should render nothing', async () => {
    const variantData: IVariantData = {
      id: undefined,
      backend: '',
      name: 'foo',
      traffic: 0.1,
      lockTraffic: false,
    };
    const { container } = render(
      <VariantPage
        sdk={sdk}
        onChange={handleChangeMock}
        data={variantData}
        index={0}
      />,
    );

    expect(container).toBeEmpty();
  });

  it('should prompt to link page', async () => {
    const variantData: IVariantData = {
      id: undefined,
      backend: 'backend-1',
      name: 'foo',
      traffic: 0.1,
      lockTraffic: false,
    };
    render(
      <VariantPage
        sdk={sdk}
        onChange={handleChangeMock}
        data={variantData}
        index={0}
      />,
    );

    expect(screen.getAllByTestId('link-page')).toBeTruthy();
  });

  it('should prompt show linked page', async () => {
    const variantData: IVariantData = {
      id: '123',
      backend: 'backend-1',
      name: 'foo',
      traffic: 0.1,
      lockTraffic: false,
    };
    render(
      <VariantPage
        sdk={sdk}
        onChange={handleChangeMock}
        data={variantData}
        index={0}
      />,
    );

    expect(screen.getAllByTestId('page-card')).toBeTruthy();
  });
});
