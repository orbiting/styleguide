import React, { useState } from 'react'
import { css } from 'glamor'
import { AccordionContext } from './Context'

const styles = {
  accordionContainer: css({
    margin: 0,
    padding: 0
  })
}

function Accordion({ children }) {
  const [activeItemIndex, setActiveItemIndex] = useState(0)
  return (
    <AccordionContext.Provider
      value={{
        activeItemIndex,
        setActiveItemIndex
      }}
    >
      <div {...styles.accordionContainer}>{children}</div>
    </AccordionContext.Provider>
  )
}

export default Accordion
