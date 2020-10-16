import React, { useState, useEffect } from 'react'
import { css } from 'glamor'
import { Interaction } from '../Typography'
import Spinner from '../Spinner'
import { useColorContext } from '../Colors/useColorContext'

const { P } = Interaction

const styles = {
  message: css({
    position: 'absolute',
    top: '50%',
    marginTop: 30,
    width: '100%',
    textAlign: 'center'
  }),
  spacer: css({
    position: 'relative',
    minHeight: 120,
    height: '100%',
    minWidth: '100%'
  })
}

const Spacer = ({ style, children }) => (
  <div {...styles.spacer} style={style}>
    {children}
  </div>
)

const Loader = ({
  style,
  message,
  loading,
  error,
  render,
  delay,
  ErrorContainer
}) => {
  const [visible, setVisible] = useState(false)
  const [colorScheme] = useColorContext()

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [])

  if (loading && !visible) {
    return <Spacer style={style} />
  } else if (loading) {
    return (
      <Spacer style={style}>
        <Spinner />
        {!!message && (
          <P {...styles.message} {...colorScheme.set('color', 'text')}>
            {message}
          </P>
        )}
      </Spacer>
    )
  } else if (error) {
    return (
      <ErrorContainer>
        <P {...colorScheme.set('color', 'error')}>
          {error.graphQLErrors && error.graphQLErrors.length
            ? error.graphQLErrors.map(e => e.message).join(', ')
            : error.toString()}
        </P>
      </ErrorContainer>
    )
  }
  return render()
}

Loader.defaultProps = {
  delay: 500,
  render: () => null,
  ErrorContainer: ({ children }) => children
}

export default Loader
