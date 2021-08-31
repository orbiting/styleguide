import React, { useMemo } from 'react'
import { css } from 'glamor'

import { mUp } from '../../theme/mediaQueries'
import { fontStyles } from '../../theme/fonts'
import { useColorContext } from '../Colors/useColorContext'

const ICON_SIZE = 24

const IconButton = React.forwardRef(
  (
    {
      Icon,
      href,
      target,
      label,
      labelShort,
      title,
      fill,
      fillColorName,
      onClick,
      children,
      style,
      size
    },
    ref
  ) => {
    const Element = href ? 'a' : 'button'
    const customStyles = style || null
    const [colorScheme] = useColorContext()

    const fillValue = fill || fillColorName || 'text'

    const marginRules = useMemo(() => {
      const hasLabel = label || labelShort || children
      return css({
        marginRight: hasLabel ? 20 : 10,
        [mUp]: {
          marginRight: hasLabel ? 24 : 12
        },
        ':last-child': {
          marginRight: 0
        },
        ':only-child': {
          margin: 0
        }
      })
    }, [label, labelShort, children])

    return (
      <Element
        {...styles.button}
        {...marginRules}
        {...((onClick || href) && styles.hover)}
        style={{
          cursor: href || onClick ? 'pointer' : 'auto',
          ...customStyles
        }}
        onClick={onClick}
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener' : ''}
        ref={ref}
        title={title}
      >
        <Icon
          {...styles.icon}
          size={size || ICON_SIZE}
          {...colorScheme.set('fill', fillValue)}
        />
        {label && (
          <span
            {...styles.label}
            {...styles.long}
            {...colorScheme.set('color', fillValue)}
          >
            {label}
          </span>
        )}
        {labelShort && (
          <span
            {...styles.label}
            {...styles.short}
            {...colorScheme.set('color', fillValue)}
          >
            {labelShort}
          </span>
        )}
        {children}
      </Element>
    )
  }
)

const styles = {
  button: css({
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    textDecoration: 'none',
    border: 0,
    padding: 0,
    color: 'inherit',
    backgroundColor: 'transparent',
    transition: 'opacity 0.3s',
    ':focus': {
      outline: 'none'
    }
  }),
  hover: css({
    '@media(hover)': {
      ':hover > *': {
        opacity: 0.6
      }
    }
  }),
  label: css({
    ...fontStyles.sansSerifMedium,
    fontSize: 14,
    marginLeft: 8,
    whiteSpace: 'nowrap'
  }),
  long: css({
    display: 'none',
    [mUp]: {
      display: 'inline'
    }
  }),
  short: css({
    display: 'inline',
    [mUp]: {
      display: 'none'
    }
  })
}

export default IconButton
