import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Formsort } from '../formsort';
import { useField } from '../../use-field';
jest.mock('../../use-field');

describe('Formsort', () => {
  let sdk: any;
  let setState: jest.Mock<any>;
  beforeEach(() => {
    sdk = {};
    setState = jest.fn();
    (useField as jest.Mock<any>).mockReturnValue([
      {
        clientLabel: '',
      },
      setState,
    ]);
  });
  it('should render Formsort and update', async () => {
    render(<Formsort sdk={sdk as any} config={{} as any} />);

    expect(screen.getByTestId('clientLabelInput')).toBeTruthy();
    expect(setState).not.toBeCalled();

    fireEvent.change(screen.getByTestId('clientLabelInput'), {
      target: { value: 'foo' },
    });
    expect(setState).toBeCalledWith({
      clientLabel: 'foo',
    });
  });
});
