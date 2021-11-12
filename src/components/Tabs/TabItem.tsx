import React, { useMemo } from 'react'
import { css } from 'glamor'
import { plainButtonRule } from '../Button'
import { useColorContext } from '../Colors/useColorContext'
import { sansSerifMedium16, sansSerifRegular16 } from '../Typography/styles'
import { mUp } from '../../theme/mediaQueries'

export type ItemType = {
  value: string
  text: string
  element?: React.ReactNode
}

export type TabItemType = {
  item: ItemType
  tabWidth: string
  activeValue: string
  showTabBorder: boolean
  handleTabClick: () => void
}

const styles = {
  tabItem: css({
    padding: '8px 16px',
    whiteSpace: 'nowrap',
    ...sansSerifRegular16,
    [mUp]: {
      padding: '8px 24px'
    },
    '&::after': {
      display: 'block',
      content: 'attr(title)',
      ...sansSerifMedium16,
      height: '1px',
      color: 'transparent',
      whiteSpace: 'nowrap',
      visibility: 'hidden',
      overflow: 'hidden'
    },
    '&:first-of-type': {
      paddingLeft: '0px'
    },
    '&:last-of-type': {
      paddingRight: '0px',
      [mUp]: {
        paddingRight: '24px'
      }
    }
  }),
  fixedItem: css({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '&:first-child': {
      paddingLeft: '16px'
    },
    '&:last-of-type': {
      paddingRight: '16px'
    },
    '&::after': {
      display: 'none',
      textOverflow: 'ellipsis'
    }
  }),
  elementContainer: css({
    display: 'flex',
    justifyContent: 'center'
  })
}

const TabItem = ({
  activeValue,
  tabWidth,
  item,
  handleTabClick,
  showTabBorder
}: TabItemType) => {
  const [colorScheme] = useColorContext()
  const isActive = activeValue === item.value

  const borderRule = useMemo(() => {
    return {
      activeButton: css({
        ...sansSerifMedium16,
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: colorScheme.getCSSColor('text')
      }),
      defaultButton: css({
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: colorScheme.getCSSColor('divider')
      })
    }
  }, [colorScheme])

  return (
    <button
      {...plainButtonRule}
      {...styles.tabItem}
      {...(!showTabBorder
        ? null
        : isActive
        ? borderRule.activeButton
        : borderRule.defaultButton)}
      {...(tabWidth !== 'auto' && styles.fixedItem)}
      style={{ width: tabWidth }}
      title={item.text}
      onClick={() => handleTabClick()}
    >
      {item.element ? (
        <div {...styles.elementContainer}>{item.element}</div>
      ) : (
        item.text
      )}
    </button>
  )
}

export default TabItem