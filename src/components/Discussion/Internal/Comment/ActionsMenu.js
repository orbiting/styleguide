import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import CalloutMenu from '../../../Callout/CalloutMenu'
import IconButton from '../../../IconButton'
import { MoreIcon } from '../../../Icons'
import { useColorContext } from '../../../Colors/ColorContext'

const MoreIconWithProps = props => (
  <IconButton title='Mehr' Icon={MoreIcon} {...props} />
)

const styles = {
  menuWrapper: css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    '> *:not(:last-child)': {
      marginBottom: '15px'
    }
  })
}

const ActionsMenu = ({ items = [] }) => {
  const [colorScheme] = useColorContext()

  if (items.length === 0) {
    return null
  }

  return (
    <CalloutMenu
      contentPaddingMobile={'30px'}
      Element={MoreIconWithProps}
      align='right'
      elementProps={{
        ...colorScheme.set('fill', 'textSoft'),
        size: 20
      }}
    >
      <div {...styles.menuWrapper}>
        {items.map(item => (
          <IconButton
            key={item.label}
            Icon={item.icon}
            label={item.label}
            labelShort={item.label}
            disabled={item.disabled}
            onClick={item.onClick}
          />
        ))}
      </div>
    </CalloutMenu>
  )
}

export const ActionsMenuItemPropType = PropTypes.shape({
  label: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool
})
ActionsMenu.propTypes = {
  items: PropTypes.arrayOf(ActionsMenuItemPropType).isRequired
}

export default ActionsMenu