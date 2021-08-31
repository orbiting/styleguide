import React from 'react'
import { css } from 'glamor'
import { fontFamilies } from '../../theme/fonts'
import { useColorContext } from '../Colors/useColorContext'
import { useIconContext } from '../Icons'

const styles = {
  label: css({
    fontSize: 16,
    lineHeight: '20px',
    fontFamily: fontFamilies.sansSerifRegular,
    cursor: 'pointer'
  }),
  input: css({
    display: 'none'
  }),
  box: css({
    display: 'inline-block',
    verticalAlign: 'middle'
  }),
  clear: css({
    clear: 'left'
  })
}

const Radio = ({ checked, disabled, alignVertically }) => {
  const [colorScheme] = useColorContext()
  const iconContext = useIconContext()
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      {...(alignVertically && iconContext)}
    >
      {checked && (
        <circle
          {...(disabled
            ? colorScheme.set('fill', 'disabled')
            : colorScheme.set('fill', 'primary'))}
          cx='12'
          cy='12'
          r='6'
        />
      )}
      <circle
        fill='none'
        {...(disabled
          ? colorScheme.set('stroke', 'divider')
          : colorScheme.set('stroke', checked ? 'primary' : 'text'))}
        cx='12'
        cy='12'
        r='11.5'
      />
    </svg>
  )
}

export default ({
  children,
  style,
  name,
  value,
  checked,
  disabled,
  onChange
}) => {
  const [colorScheme] = useColorContext()
  return (
    <label
      {...styles.label}
      {...(disabled
        ? colorScheme.set('color', 'disabled')
        : colorScheme.set('color', 'text'))}
      style={{ ...style }}
    >
      <span {...styles.box} style={{ marginRight: children ? 10 : 0 }}>
        <Radio
          checked={checked}
          disabled={disabled}
          alignVertically={!children}
        />
      </span>
      <input
        {...styles.input}
        name={name}
        type='radio'
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      {children}
      <span {...styles.clear} />
    </label>
  )
}
