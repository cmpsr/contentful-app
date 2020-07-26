import React from 'react';
import Downshift from 'downshift';
import styled, { css } from 'styled-components';

type OptionType = {
  value: string;
  image: string;
};

interface DropdownProps {
  items: OptionType[];
  valueSelected: string;
  onChange: (selectedItem: string) => void;
}

const Container = styled.form`
  overflow: hidden;
`;

const List = styled.ul<{ isOpen: true }>`
  width: 100%;
  z-index: 1000;
  max-height: 200px;
  background-color: #fff;
  list-style: none;
  padding-left: 0;
  overflow-y: auto;
  &:focus {
    outline: none;
  }
  ${props =>
    props.isOpen &&
    css`
      border: 1px solid rgba(0, 0, 0, 0.15);
      border-radius: 0.25rem;
    `}
`;

const Item = styled.li`
  padding: 8px 16px;
  background-color: #fff;
  display: flex;
  text-align: left;
  align-items: center;
  justify-content: flex-start;
  text-decoration: none;
  &:hover {
    background-color: #eff0f1;
  }
`;

const Image = styled.img`
  margin-right: 1rem;
`;

const ItemBody = styled.div`
  flex: 1;
`;

const ItemSelected = styled.div`
  display: flex;
  align-items: center;
  padding: 0 8px;
`;

const Button = styled.button`
  border: 1px solid #d3dce0;
  outline: none;
  background-color: #fff;
  width: 100%;
  padding: 8px;
  font-size: 0.875rem;
  color: #536171;
  text-align: left;
  display: flex;
  justify-content: space-between;
`;

export const Dropdown: React.FC<DropdownProps> = ({
  items,
  onChange,
  valueSelected,
}) => {
  return (
    <Downshift
      onChange={selectedItem =>
        onChange(selectedItem ? selectedItem.value : '')
      }
    >
      {({
        isOpen,
        selectedItem,
        getRootProps,
        getToggleButtonProps,
        getMenuProps,
        getItemProps,
      }) => {
        //console.log(valueSelected, selectedItem);
        if (valueSelected && !selectedItem) {
          selectedItem = items.find(item => item.value === valueSelected);
        }

        return (
          <Container {...getRootProps()}>
            <Button {...getToggleButtonProps()}>
              {(selectedItem && (
                <ItemSelected>
                  <Image src={selectedItem.image} />
                  {selectedItem.value}
                </ItemSelected>
              )) ||
                'Select an item'}
              <svg
                height="20"
                width="20"
                viewBox="0 0 20 20"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z" />
              </svg>
            </Button>
            <List isOpen={isOpen} {...getMenuProps()}>
              {isOpen &&
                items.map((item, index) => (
                  <Item
                    key={`${item}${index}`}
                    {...getItemProps({ item, index })}
                  >
                    <Image src={item.image} />
                    <ItemBody>{item.value}</ItemBody>
                  </Item>
                ))}
            </List>
          </Container>
        );
      }}
    </Downshift>
  );
};
