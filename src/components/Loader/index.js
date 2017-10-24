import React, { Component } from 'react'
import { css } from 'glamor'
import colors from '../../theme/colors'
import { Interaction } from '../Typography'
import { NarrowContainer } from '../Grid'
import Spinner from '../Spinner'

const { P } = Interaction

const styles = {
  error: css({
    color: colors.error
  }),
  message: css({
    position: 'absolute',
    top: '50%',
    marginTop: 30,
    width: '100%',
    textAlign: 'center'
  }),
  spacer: css({
    position: 'relative',
    minHeight: '100%',
    minWidth: '100%'
  })
}

const ErrorMessage = ({ error }) => (
  <P {...styles.error}>
    {error.graphQLErrors && error.graphQLErrors.length ? (
      error.graphQLErrors.map(e => e.message).join(', ')
    ) : (
      error.toString()
    )}
  </P>
)

const Spacer = ({ height, width, children }) => (
  <div {...styles.spacer} style={{ minWidth: width, minHeight: height }}>
    {children}
  </div>
)

class Loader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }
  }
  componentDidMount() {
    this.timeout = setTimeout(
      () => this.setState({ visible: true }),
      this.props.delay
    )
  }
  componentWillUnmount() {
    clearTimeout(this.timeout)
  }
  render() {
    const { visible } = this.state
    const { width, height, message, loading, error, render } = this.props
    if (loading && !visible) {
      return <Spacer width={width} height={height} />
    } else if (loading) {
      return (
        <Spacer width={width} height={height}>
          <Spinner />
          {!!message && <P {...styles.message}>{message}</P>}
        </Spacer>
      )
    } else if (error) {
      return (
        <Spacer width={width} height={height}>
          <NarrowContainer>
            <ErrorMessage error={error} />
          </NarrowContainer>
        </Spacer>
      )
    }
    return render()
  }
}

Loader.defaultProps = {
  delay: 500,
  render: () => null
}

export default Loader