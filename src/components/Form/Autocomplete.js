import React from 'react'
import Downshift from 'downshift'
import PropTypes from 'prop-types'

import { ItemsContainer, Items, Inner, styles, itemToString } from './VirtualDropdown'
import Field from './Field'

const Autocomplete = ({
  items,
  label,
  value,
  onChange,
  filter,
  onFilterChange
}) => {
  return (
    <Downshift {...{
      onChange,
      selectedItem: value,
      onInputValueChange: filter => onFilterChange(filter || ''),
      itemToString
    }}>
      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        selectedItem,
        highlightedIndex,
        isOpen
      }) => {
        return <div {...styles.root}>
          <Inner isOpen={isOpen}>
            <Field
              label={label}
              renderInput={
                fieldProps => {
                  return <input {...{...fieldProps, ...getInputProps()}} />
                }
              }
            />
            {isOpen && items.length > 0
            ? <ItemsContainer isOpen={isOpen}>
              <Items
                {...{
                  items,
                  selectedItem,
                  highlightedIndex,
                  getItemProps
                }}
                />
            </ItemsContainer>
            : null}
          </Inner>
        </div>
      }}
    </Downshift>
  )
}

Autocomplete.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      value: PropTypes.any
    })
  ).isRequired,
  value: PropTypes.shape({
    text: PropTypes.string,
    value: PropTypes.any
  }),
  filter: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired
}

export default Autocomplete
