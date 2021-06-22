import React, { useContext } from 'react'
import { css } from 'glamor'
import { AccordionContext, AccordionItemContext } from './Context'
import { plainButtonRule } from '../Button'
import { ChevronLeftIcon } from '../Icons'

const styles = {
  header: css({
    margin: 0,
    transition: 'background-color 0.2s ease',
    padding: 8
  }),
  button: css({
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  })
}

const AccordionItemHeader = ({ children }) => {
  const { eventKey } = useContext(AccordionItemContext)
  const { activeItemIndex, setActiveItemIndex } = useContext(AccordionContext)

  const isOpen = eventKey === activeItemIndex
  const accordionOnClick = () => {
    const eventKeyPassed = isOpen ? null : eventKey
    setActiveItemIndex(eventKeyPassed)
  }

  return (
    <div {...styles.header}>
      <button
        {...styles.button}
        {...plainButtonRule}
        onClick={accordionOnClick}
      >
        {children}
        <ChevronLeftIcon
          size={24}
          style={{
            transtion: 'translate 0.3s ease',
            transform: `rotate(${isOpen ? '-90deg' : '90deg'})`
          }}
        />
      </button>
    </div>
  )
}

export default AccordionItemHeader
