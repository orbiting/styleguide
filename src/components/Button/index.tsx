import React, {
  Attributes,
  MouseEventHandler,
  PropsWithChildren,
  useMemo
} from 'react'
import { css, merge, simulate } from 'glamor'
import { fontStyles } from '../../theme/fonts'
import { pxToRem } from '../Typography/utils'
import { useColorContext } from '../Colors/ColorContext'

export const plainButtonRule = css({
  fontFamily: 'inherit',
  fontWeight: 'inherit',
  fontStyle: 'inherit',
  color: 'inherit',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  outline: 'none',
  appearance: 'none',
  padding: 0
})

const styles = {
  default: css(plainButtonRule, {
    verticalAlign: 'bottom',
    padding: '10px 20px 10px 20px',
    minWidth: 160,
    textAlign: 'center',
    textDecoration: 'none',
    fontSize: pxToRem(22),
    height: pxToRem(60),
    boxSizing: 'border-box',
    backgroundColor: 'transparent',
    ...fontStyles.sansSerifRegular,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 0
  }),
  link: css({
    display: 'inline-block',
    verticalAlign: 'middle',
    lineHeight: 1.5,
    height: 'inherit',
    minHeight: pxToRem(60)
  }),
  block: css({
    display: 'block',
    width: '100%'
  }),
  big: css({
    fontSize: pxToRem(22),
    height: pxToRem(80),
    padding: '10px 30px 10px 30px'
  })
}

const Button = React.forwardRef<
  HTMLAnchorElement & HTMLButtonElement,
  PropsWithChildren<{
    onClick?: MouseEventHandler<HTMLAnchorElement> &
      MouseEventHandler<HTMLButtonElement>
    type?: 'button' | 'submit' | 'reset'
    primary?: boolean
    big?: boolean
    block?: boolean
    disabled?: boolean
    href?: string
    title?: string
    target?: string
    style?: React.CSSProperties
    simulate?: string
    attributes?: Attributes
  }>
>(
  (
    {
      onClick,
      type,
      children,
      primary,
      big,
      block,
      style,
      disabled,
      href,
      title,
      target,
      simulate: sim,
      attributes
    },
    ref
  ) => {
    const [colorScheme] = useColorContext()
    const buttonStyleRules = useMemo(
      () =>
        css({
          backgroundColor: colorScheme.getCSSColor(
            primary ? 'primary' : 'transparent'
          ),
          borderColor: colorScheme.getCSSColor(primary ? 'primary' : 'text'),
          color: colorScheme.getCSSColor(primary ? '#FFF' : 'text'),
          '@media (hover)': {
            ':hover': {
              backgroundColor: colorScheme.getCSSColor(
                primary ? 'primaryHover' : 'primary'
              ),
              borderColor: colorScheme.getCSSColor(
                primary ? 'primaryHover' : 'primary'
              ),
              color: colorScheme.getCSSColor('#FFF')
            }
          },
          ':active': {
            backgroundColor: colorScheme.getCSSColor(
              primary ? 'primaryHover' : 'primary'
            ),
            borderColor: colorScheme.getCSSColor(
              primary ? 'primaryHover' : 'primary'
            ),
            color: colorScheme.getCSSColor('#FFF')
          },
          ':disabled, [disabled]': {
            backgroundColor: 'transparent',
            cursor: 'default',
            color: colorScheme.getCSSColor('disabled'),
            borderColor: colorScheme.getCSSColor('disabled'),
            '@media (hover)': {
              ':hover': {
                backgroundColor: 'transparent',
                color: colorScheme.getCSSColor('disabled'),
                borderColor: colorScheme.getCSSColor('disabled')
              }
            }
          }
        }),

      [colorScheme, primary]
    )
    const simulations = sim ? simulate(sim) : {}
    const buttonStyles = merge(
      styles.default,
      buttonStyleRules,
      href && styles.link,
      block && styles.block,
      big && styles.big
    )

    const Element = href ? 'a' : 'button'

    return (
      <Element
        onClick={onClick}
        href={href}
        title={title}
        type={type}
        style={style}
        disabled={disabled}
        target={target}
        {...attributes}
        {...buttonStyles}
        {...simulations}
        ref={ref}
      >
        {children}
      </Element>
    )
  }
)

export default Button
