import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { css } from 'glamor'

import { measure } from './utils'
import Bar, { Lollipop } from './Bars'
import TimeBar from './TimeBars'
import { Line, Slope } from './Lines'
import ScatterPlot from './ScatterPlots'

import colors from '../../theme/colors'

import { mUp } from '../../theme/mediaQueries'
import { sansSerifMedium19, sansSerifMedium22, sansSerifRegular16, sansSerifRegular19 } from '../Typography/styles'

export const ReactCharts = {
  Bar,
  Lollipop,
  TimeBar,
  Line,
  Slope,
  ScatterPlot
}

const createRanges = ({neutral, sequential3, opposite3, discrete}) => {
  const oppositeReversed = [].concat(opposite3).reverse()
  return {
    diverging1: [sequential3[1], opposite3[1]],
    diverging1n: [sequential3[1], neutral, opposite3[1]],
    diverging2: [...sequential3.slice(0, 2), ...oppositeReversed.slice(0, 2)],
    diverging3: [...sequential3, ...oppositeReversed],
    sequential3,
    discrete
  }
}

const colorRanges = createRanges(colors)

const styles = {
  h: css({
    ...sansSerifMedium19,
    lineHeight: '25px',
    [mUp]: {
      ...sansSerifMedium22
    },
    color: colors.text,
    margin: 0,
    marginBottom: 15,
    '& + p': {
      marginTop: -15
    }
  }),
  p: css({
    color: colors.text,
    ...sansSerifRegular16,
    [mUp]: {
      ...sansSerifRegular19
    },
    margin: 0,
    marginBottom: 15
  })
}

export const ChartTitle = ({children, ...props}) => (
  <h3 {...props} {...styles.h}>{children}</h3>
)

export const ChartLead = ({children, ...props}) => (
  <p {...props} {...styles.p}>{children}</p>
)

class Chart extends Component {
  constructor(props) {
    super(props)

    this.state = {
      width: 290
    }
    this.measure = measure((ref, {width}) => {
      if (width !== this.state.width) {
        this.setState({width})
      }
    })
  }
  render() {
    const {width: fixedWidth, config, tLabel} = this.props

    const width = fixedWidth || this.state.width
    const ReactChart = ReactCharts[config.type]

    return (
      <div ref={fixedWidth ? undefined : this.measure} style={{
        maxWidth: config.maxWidth
      }}>
        {!!width && (
          <ReactChart {...config}
            tLabel={tLabel}
            colorRanges={colorRanges}
            width={width}
            values={this.props.values}
            description={config.description} />
        )}
      </div>
    )
  }
}

Chart.propTypes = {
  values: PropTypes.array.isRequired,
  config: PropTypes.shape({
    type: PropTypes.oneOf(Object.keys(ReactCharts)).isRequired,
    description: PropTypes.string,
    maxWidth: PropTypes.number
  }).isRequired,
  width: PropTypes.number,
  tLabel: PropTypes.func.isRequired
}

Chart.defaultProps = {
  tLabel: identity => identity
}

export default Chart
