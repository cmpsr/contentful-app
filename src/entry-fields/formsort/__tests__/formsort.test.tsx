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
        url: '',
      },
      setState,
    ]);
  });
  it('should render Formsort and update', async () => {
    render(<Formsort sdk={sdk as any} config={{} as any} />);

    expect(screen.getByTestId('urlInput')).toBeTruthy();
    expect(setState).not.toBeCalled();

    fireEvent.change(screen.getByTestId('urlInput'), {
      target: { value: 'foo' },
    });
    expect(setState).toBeCalledWith({
      url: 'foo',
    });
  });
});
