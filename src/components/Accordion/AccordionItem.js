import React from 'react'
import { css } from 'glamor'
import { AccordionItemContext } from './Context'
import { useColorContext } from '../Colors/ColorContext'

const styles = {
  accordionItem: css({
    '&:not(:last-of-type)': {
      borderBottomWidth: 1,
      borderBottomStyle: 'solid'
    }
  })
}

const AccordionItem = ({ children, eventKey = 0 }) => {
  const [colorScheme] = useColorContext()
  return (
    <AccordionItemContext.Provider value={{ eventKey: eventKey }}>
      <div
        {...styles.accordionItem}
        {...colorScheme.set('borderColor', 'divider')}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
}

export default AccordionItem
