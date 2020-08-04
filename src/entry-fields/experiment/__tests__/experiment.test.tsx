import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Experiment } from '../experiment';
import { useField } from '../../use-field';
jest.mock('../../use-field');
jest.mock('../variants', () => {
  return {
    Variants: () => <div data-test-id="Variants">there</div>,
  };
});

describe('Experiment', () => {
  let sdk: any;
  let setState: jest.Mock<any>;
  beforeEach(() => {
    sdk = {};
    setState = jest.fn();
    (useField as jest.Mock<any>).mockReturnValue([
      {
        allocation: 1,
      },
      setState,
    ]);
  });
  it('should render TrafficAllocationTextField and update', async () => {
    render(<Experiment sdk={sdk as any} config={{} as any} />);

    expect(screen.getByTestId('TrafficAllocationTextField')).toBeTruthy();
    expect(setState).not.toBeCalled();

    fireEvent.change(screen.getByTestId('TrafficAllocationTextField'), {
      target: { value: '2' },
    });
    expect(setState).toBeCalledWith({
      allocation: 2,
    });
  });
  it('should render Variants and update', async () => {
    render(<Experiment sdk={sdk as any} config={{} as any} />);

    expect(screen.getByTestId('Variants')).toBeTruthy();
  });
});
