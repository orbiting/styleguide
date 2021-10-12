import PropTypes from 'prop-types'
import React from 'react'
import { ascending } from 'd3-array'
import { sortPropType } from './utils'
import ColorLegend from './ColorLegend'
import TimeBarGroup from './TimeBarGroup'
import { intervals } from './TimeBars.utils'
import XAxis from './XAxis'
import { ChartContext } from './ChartContext'

import { PADDING_TOP } from './Layout.constants'
import { defaultProps } from './ChartContext'

const TimeBarChart = props => {
  const {
    width,
    tLabel,
    description,
    yAnnotations,
    xAnnotations,
    xUnit,
    yScaleInvert,
    height: innerHeight
  } = props

  const chartContext = React.useContext(ChartContext)
  const { groupPosition } = chartContext

  chartContext.groupedData.forEach(group => {
    group.bars.forEach(bar => {
      let upValue = 0
      let upPos = chartContext.yAxis.scale(0)
      let downValue = 0
      let downPos = chartContext.yAxis.scale(0)
      bar.segments.forEach(segment => {
        const isPositive = yScaleInvert ? segment.value < 0 : segment.value > 0
        const baseValue = isPositive ? upValue : downValue
        const y0 = chartContext.yAxis.scale(baseValue)
        const y1 = chartContext.yAxis.scale(baseValue + segment.value)
        const size = (segment.height = Math.abs(y0 - y1))
        if (isPositive) {
          upPos -= size
          segment.y = upPos
          upValue += segment.value
        } else {
          segment.y = downPos
          downPos += size
          downValue += segment.value
        }
      })
    })
  })

  const yTicks = [].concat(chartContext.yAxis.ticks).sort(ascending)

  const xAxisElement = (
    <XAxis
      xTicks={chartContext.xAxis.ticks}
      width={chartContext.innerWidth}
      height={chartContext.height}
      x={chartContext.xAxis.scale}
      xDomain={chartContext.xAxis.domain}
      xUnit={xUnit}
      yScaleInvert={yScaleInvert}
      format={chartContext.xAxis.axisFormat}
      type={props.type}
    />
  )

  return (
    <>
      <ColorLegend inline values={chartContext.colorLegendValues} />
      <svg width={width} height={chartContext.height}>
        <desc>{description}</desc>
        {chartContext.groupedData.map(({ bars, key }) => {
          return (
            <g
              key={key || 1}
              transform={`translate(${groupPosition.x(key)},${groupPosition.y(
                key
              )})`}
            >
              <TimeBarGroup
                bars={bars}
                title={key}
                xAnnotations={xAnnotations}
                yAnnotations={yAnnotations}
                yTicks={yTicks}
                x={chartContext.xAxis.scale}
                y={chartContext.yAxis.scale}
                xNormalizer={chartContext.xNormalizer}
                yAxis={chartContext.yAxis}
                width={chartContext.innerWidth}
                xAxisElement={xAxisElement}
                xAxisPos={
                  yScaleInvert
                    ? PADDING_TOP + PADDING_TOP / 2 + groupPosition.titleHeight
                    : innerHeight + PADDING_TOP + groupPosition.titleHeight
                }
                tLabel={tLabel}
                color={d => chartContext.color(chartContext.colorAccessor(d))}
                yScaleInvert={yScaleInvert}
              />
            </g>
          )
        })}
      </svg>
    </>
  )
}

export const propTypes = {
  values: PropTypes.array.isRequired,
  padding: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  mini: PropTypes.bool,
  height: PropTypes.number.isRequired,
  color: PropTypes.string,
  colorRange: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  colorLegend: PropTypes.bool,
  colorLegendValues: PropTypes.arrayOf(PropTypes.string),
  colorRanges: PropTypes.shape({
    sequential3: PropTypes.array.isRequired,
    discrete: PropTypes.array.isRequired
  }).isRequired,
  colorMap: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  domain: PropTypes.arrayOf(PropTypes.number),
  yTicks: PropTypes.arrayOf(PropTypes.number),
  yAnnotations: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
      unit: PropTypes.string,
      label: PropTypes.string.isRequired,
      x: PropTypes.string,
      dy: PropTypes.string,
      showValue: PropTypes.bool
    })
  ).isRequired,
  timeParse: PropTypes.string.isRequired,
  timeFormat: PropTypes.string,
  xBandPadding: PropTypes.number.isRequired,
  x: PropTypes.string.isRequired,
  xInterval: PropTypes.oneOf(Object.keys(intervals)),
  xTicks: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  ),
  xScale: PropTypes.oneOf(['time', 'ordinal', 'linear']),
  xAnnotations: PropTypes.arrayOf(
    PropTypes.shape({
      valuePrefix: PropTypes.string,
      value: PropTypes.number.isRequired,
      unit: PropTypes.string,
      label: PropTypes.string,
      x: PropTypes.string,
      x1: PropTypes.string,
      x2: PropTypes.string,
      ghost: PropTypes.bool,
      position: PropTypes.oneOf(['top', 'bottom']),
      showValue: PropTypes.bool
    })
  ).isRequired,
  unit: PropTypes.string,
  xUnit: PropTypes.string,
  numberFormat: PropTypes.string.isRequired,
  filter: PropTypes.string,
  tLabel: PropTypes.func.isRequired,
  description: PropTypes.string,
  column: PropTypes.string,
  columnSort: sortPropType,
  columnFilter: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      test: PropTypes.string.isRequired
    })
  ),
  columns: PropTypes.number.isRequired,
  minInnerWidth: PropTypes.number.isRequired,
  yScaleInvert: PropTypes.bool
}

TimeBarChart.propTypes = propTypes

TimeBarChart.defaultProps = defaultProps.TimeBar

export default TimeBarChart
