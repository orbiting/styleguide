import React, { useEffect, useState, useRef, Fragment } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'

import ColorLegend from './ColorLegend'
import { scaleLinear, scaleLog, scaleSqrt } from 'd3-scale'
import { extent, ascending, min, max } from 'd3-array'
import ContextBox, {
  ContextBoxValue,
  mergeFragments,
  formatLines
} from './ContextBox'
import {
  calculateAxis,
  subsup,
  runSort,
  deduplicate,
  sortPropType,
  last,
  get3EqualDistTicks,
  getFormat
} from './utils'
import { getColorMapper } from './colorMaps'
import { sansSerifRegular12, sansSerifMedium12 } from '../Typography/styles'
import { useColorContext } from '../Colors/useColorContext'
import { replaceKeys } from '../../lib/translate'

const X_TICK_HEIGHT = 6

const scales = {
  linear: scaleLinear,
  log: scaleLog
}

const styles = {
  axisLabel: css({
    ...sansSerifRegular12
  }),
  axisLine: css({
    strokeWidth: '1px',
    shapeRendering: 'crispEdges'
  }),
  inlineLabel: css({
    ...sansSerifMedium12
  }),
  inlineSecondaryLabel: css({
    ...sansSerifRegular12
  }),
  annotationLine: css({
    strokeWidth: '1px',
    fillRule: 'evenodd',
    strokeLinecap: 'round',
    strokeDasharray: '1,3',
    strokeLinejoin: 'round'
  }),
  annotationText: css({
    ...sansSerifMedium12
  })
}

const ScatterPlot = props => {
  const [hover, setHover] = useState([])
  const [hoverTouch, setHoverTouch] = useState()

  const containerRef = useRef()
  const hoverRectRef = useRef()
  const [colorScheme] = useColorContext()

  const {
    values,
    width,
    height,
    heightRatio,
    x,
    xUnit,
    xNice,
    xTicks,
    xLines,
    xScale,
    xNumberFormat,
    xShowValue,
    y,
    yUnit,
    yNice,
    yTicks,
    yLines,
    yScale,
    yNumberFormat,
    yShowValue,
    numberFormat,
    opacity,
    color,
    colorLegend,
    colorLegendValues,
    colorRange,
    colorRanges,
    colorMap,
    colorSort,
    size,
    sizeRange,
    sizeRangeMax,
    sizeUnit,
    sizeNumberFormat,
    sizeShowValue,
    label,
    inlineLabel,
    inlineLabelPosition,
    inlineSecondaryLabel,
    detail,
    tLabel,
    description,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    tooltipLabel,
    tooltipBody,
    annotations
  } = props

  const data = values
    .filter(d => d[x] && d[x].length > 0 && d[y] && d[y].length > 0)
    .map(d => {
      const dSize = d[size]
      return {
        datum: d,
        x: +d[x],
        y: +d[y],
        size: dSize === undefined ? 1 : +d[size] || 0
      }
    })

  const innerWidth = width - paddingLeft - paddingRight
  const plotHeight =
    height || innerWidth * heightRatio + paddingTop + paddingBottom
  const innerHeight = plotHeight - paddingTop - paddingBottom

  // setup x axis
  let xValues = data.map(d => d.x)
  if (xTicks) {
    xValues = xValues.concat(xTicks)
  }
  if (xLines) {
    xValues = xValues.concat(xLines.map(line => line.tick))
  }
  if (annotations) {
    xValues = xValues
      .concat(annotations.map(annotation => annotation.x1))
      .concat(annotations.map(annotation => annotation.x2))
  }
  const plotX = scales[xScale]()
    .domain(extent(xValues))
    .range([paddingLeft, paddingLeft + innerWidth])
  const plotXNice =
    xNice === undefined
      ? Math.min(Math.max(Math.round(innerWidth / 150), 3), 5)
      : xNice
  if (plotXNice) {
    plotX.nice(plotXNice)
  }
  const xAxis = calculateAxis(
    xNumberFormat || numberFormat,
    tLabel,
    plotX.domain(),
    undefined,
    {
      ticks: xLines ? xLines.map(line => line.tick) : xTicks
    }
  ) // xUnit is rendered separately
  const plotXLines =
    xLines ||
    (
      xTicks || (xScale === 'log' ? get3EqualDistTicks(plotX) : xAxis.ticks)
    ).map(tick => ({ tick }))
  // ensure highest value is last: the last value is labled with the unit
  plotXLines.sort((a, b) => ascending(a.tick, b.tick))

  // setup y axis
  let yValues = data.map(d => d.y)
  if (yTicks) {
    yValues = yValues.concat(yTicks)
  }
  if (yLines) {
    yValues = yValues.concat(yLines.map(line => line.tick))
  }
  if (annotations) {
    yValues = yValues
      .concat(annotations.map(annotation => annotation.y1))
      .concat(annotations.map(annotation => annotation.y2))
  }
  const plotY = scales[yScale]()
    .domain(extent(yValues))
    .range([innerHeight + paddingTop, paddingTop])
  const plotYNice =
    yNice === undefined
      ? Math.min(Math.max(Math.round(innerHeight / 150), 3), 5)
      : yNice
  if (plotYNice) {
    plotY.nice(plotYNice)
  }
  const yAxis = calculateAxis(
    yNumberFormat || numberFormat,
    tLabel,
    plotY.domain(),
    tLabel(yUnit),
    {
      ticks: yLines ? yLines.map(line => line.tick) : yTicks
    }
  )
  const plotYLines =
    yLines ||
    (
      yTicks || (yScale === 'log' ? get3EqualDistTicks(plotY) : yAxis.ticks)
    ).map(tick => ({ tick }))
  // ensure highest value is last: the last value is labled with the unit
  plotYLines.sort((a, b) => ascending(a.tick, b.tick))
  const maxYLine = plotYLines[plotYLines.length - 1]

  const colorAccessor = d => d.datum[color]
  const colorValues = []
    .concat(data.map(colorAccessor))
    .concat(colorLegendValues)
    .filter(deduplicate)
    .filter(Boolean)
  runSort(colorSort, colorValues)

  let plotColorRange = colorRanges[colorRange] || colorRange
  if (!plotColorRange) {
    plotColorRange =
      colorValues.length > 3 ? colorRanges.discrete : colorRanges.sequential3
  }
  const colorMapper = getColorMapper(
    { colorMap, colorRanges, colorRange },
    colorValues
  )

  const yLinesPaddingLeft = paddingLeft < 2 ? paddingLeft : 0

  const displayedColorLegendValues = []
    .concat(
      colorLegend &&
        (colorLegendValues || colorValues).map(colorValue => ({
          color: colorMapper(colorValue),
          label: colorValue
        }))
    )
    .filter(Boolean)

  const rSize = scaleSqrt()
    .domain([0, max(data, d => d.size)])
    .range([
      0,
      sizeRange
        ? sizeRange[1] // backwards compatible
        : sizeRangeMax
    ])

  const symbols = data.map((value, i) => {
    return {
      key: `symbol${i}`,
      value,
      cx: plotX(value.x),
      cy: plotY(value.y),
      r: rSize(value.size)
    }
  })

  const focusRef = useRef()
  const focus = (focusRef.current = event => {
    if (!symbols) {
      return
    }
    const { left, top } = containerRef.current.getBoundingClientRect()
    let hoverTouchItem = false
    let currentEvent = event
    if (currentEvent.changedTouches) {
      hoverTouchItem = true
      currentEvent = currentEvent.changedTouches[0]
    }

    const focusX = currentEvent.clientX - left
    const focusY = currentEvent.clientY - top

    const withDistance = symbols.map(symbol => {
      return {
        symbol,
        distance:
          Math.sqrt(
            Math.pow(symbol.cx - focusX, 2) + Math.pow(symbol.cy - focusY, 2)
          ) - symbol.r
      }
    })
    let hoverItems = withDistance.filter(({ distance }) => distance < 1)
    if (hoverItems.length === 0) {
      const minDistance = min(withDistance, d => d.distance)
      if (minDistance < 10) {
        hoverItems = withDistance.filter(
          ({ distance }) => distance === minDistance
        )
      }
    }
    if (hoverItems.length) {
      event.preventDefault()
    }
    hoverItems = hoverItems.map(({ symbol }) => symbol)
    setHover(hoverItems)
    setHoverTouch(hoverTouchItem)
  })
  const blur = () => {
    setHover([])
  }

  useEffect(() => {
    const focusCallback = event => focusRef.current(event)
    const blurCallback = () => {
      setHover([])
    }
    const rect = hoverRectRef.current
    rect.addEventListener('touchstart', focusCallback, {
      passive: false
    })
    rect.addEventListener('touchmove', focusCallback)
    rect.addEventListener('touchend', blurCallback)
    return () => {
      rect.removeEventListener('touchstart', focusCallback, {
        passive: false
      })
      rect.removeEventListener('touchmove', focusCallback)
      rect.removeEventListener('touchend', blurCallback)
    }
  }, [])

  const renderHover = ({ width, height, xFormat, yFormat }) => {
    if (!hover.length) {
      return null
    }

    const sizeFormat = getFormat(sizeNumberFormat || numberFormat, tLabel)

    const { cx, cy, r } = hover.sort((a, b) => ascending(a.cy, b.cy))[0]
    const top = hoverTouch || cy > height / 3
    const yOffset = r + (hoverTouch ? 40 : 12)
    return (
      <ContextBox
        orientation={top ? 'top' : 'below'}
        x={cx}
        y={cy + (top ? -yOffset : yOffset)}
        contextWidth={width}
      >
        {hover.map(({ value }, i) => {
          const replacements = {
            ...value.datum,
            y: value.y,
            x: value.x,
            size: value.size,
            formattedY: yFormat(value.y),
            formattedX: xFormat(value.x),
            formattedSize: sizeFormat(value.size)
          }
          const contextT = text => replaceKeys(text, replacements)
          return (
            <ContextBoxValue
              key={`${value.datum[label]}${i}`}
              label={tooltipLabel ? contextT(tooltipLabel) : value.datum[label]}
            >
              {mergeFragments(
                tooltipBody
                  ? formatLines(contextT(tooltipBody))
                  : [
                      value.datum[detail],
                      yShowValue && `${replacements.formattedY} ${yUnit}`,
                      xShowValue && `${replacements.formattedX} ${xUnit}`,
                      sizeShowValue &&
                        `${replacements.formattedSize} ${sizeUnit}`
                    ]
                      .filter(Boolean)
                      .map(formatLines)
              )}
            </ContextBoxValue>
          )
        })}
      </ContextBox>
    )
  }

  return (
    <>
      <ColorLegend inline values={displayedColorLegendValues} />
      <div style={{ position: 'relative' }} ref={containerRef}>
        <svg width={width} height={plotHeight}>
          <desc>{description}</desc>
          {symbols.map((symbol, i) => (
            <circle
              key={symbol.key}
              style={{ opacity }}
              {...colorScheme.set(
                'fill',
                colorMapper(colorAccessor(symbol.value)),
                'charts'
              )}
              cx={symbol.cx}
              cy={symbol.cy}
              r={symbol.r}
            />
          ))}
          {(inlineLabel || inlineSecondaryLabel) &&
            symbols
              .filter(
                ({ value: { datum } }) =>
                  datum[inlineLabel] || datum[inlineSecondaryLabel]
              )
              .map((symbol, i) => {
                const { datum } = symbol.value
                const primary = datum[inlineLabel]
                const secondary = datum[inlineSecondaryLabel]
                const pos = datum[inlineLabelPosition] || 'center'
                let textAnchor = 'middle'
                let yOffset = 0
                let xOffset = 0
                if (pos === 'left') {
                  textAnchor = 'end'
                  xOffset = -(symbol.r + 5)
                }
                if (pos === 'right') {
                  textAnchor = 'start'
                  xOffset = symbol.r + 5
                }
                if (pos === 'top' || pos === 'bottom') {
                  yOffset = symbol.r + 5 + (primary && secondary ? 15 : 7)
                  if (pos === 'top') {
                    yOffset = -yOffset
                  }
                }

                return (
                  <g
                    key={`inlineLabel${symbol.key}`}
                    textAnchor={textAnchor}
                    transform={`translate(${symbol.cx + xOffset},${symbol.cy +
                      yOffset})`}
                  >
                    {primary && (
                      <text
                        {...styles.inlineLabel}
                        {...colorScheme.set('fill', 'text')}
                        dy={secondary ? '-0.3em' : '0.4em'}
                      >
                        {subsup.svg(primary)}
                      </text>
                    )}
                    {secondary && (
                      <text
                        {...styles.inlineSecondaryLabel}
                        {...colorScheme.set('fill', 'text')}
                        dy={primary ? '0.9em' : '0.4em'}
                      >
                        {subsup.svg(secondary)}
                      </text>
                    )}
                  </g>
                )
              })}
          {hover.map((symbol, i) => (
            <circle
              key={`hover${symbol.key}`}
              fill='none'
              {...colorScheme.set('stroke', 'text')}
              cx={symbol.cx}
              cy={symbol.cy}
              r={symbol.r}
            />
          ))}
          {plotYLines.map(({ tick, label, base }, i) => (
            <g
              key={tick}
              transform={`translate(${yLinesPaddingLeft},${plotY(tick)})`}
            >
              <line
                {...styles.axisLine}
                {...colorScheme.set('stroke', 'text')}
                x2={width - paddingRight - yLinesPaddingLeft}
                style={{
                  opacity:
                    base || (base === undefined && tick === 0) ? 0.8 : 0.17
                }}
              />
              <text
                {...styles.axisLabel}
                {...colorScheme.set('fill', 'text')}
                dy='-3px'
              >
                {subsup.svg(
                  label || yAxis.axisFormat(tick, last(plotYLines, i))
                )}
              </text>
            </g>
          ))}
          {plotXLines.map(({ tick, label, textAnchor, base }, i) => {
            if (!textAnchor) {
              textAnchor = 'middle'
              if (last(plotXLines, i)) {
                textAnchor = 'end'
              }
              if (i === 0 && paddingLeft < 20) {
                textAnchor = 'start'
              }
            }
            return (
              <g
                key={`x${tick}`}
                transform={`translate(${plotX(tick)},${paddingTop +
                  innerHeight +
                  X_TICK_HEIGHT})`}
              >
                <line
                  {...styles.axisLine}
                  {...colorScheme.set('stroke', 'text')}
                  y2={
                    -(
                      (maxYLine
                        ? plotY(plotY.domain()[0]) - plotY(maxYLine.tick)
                        : innerHeight) + X_TICK_HEIGHT
                    )
                  }
                  style={{
                    opacity:
                      base || (base === undefined && tick === 0) ? 0.8 : 0.17
                  }}
                />
                <text
                  {...styles.axisLabel}
                  {...colorScheme.set('fill', 'text')}
                  y={5}
                  dy='0.6em'
                  textAnchor={textAnchor}
                >
                  {subsup.svg(
                    label || xAxis.axisFormat(tick, last(plotXLines, i))
                  )}
                </text>
              </g>
            )
          })}
          <text
            x={paddingLeft + innerWidth}
            y={paddingTop + innerHeight + 28 + X_TICK_HEIGHT}
            textAnchor='end'
            {...styles.axisLabel}
            {...colorScheme.set('fill', 'text')}
          >
            {xUnit}
          </text>
          {annotations.map((annotation, i) => {
            const x1 = plotX(annotation.x1)
            const x2 = plotX(annotation.x2)
            const y1 = plotY(annotation.y1)
            const y2 = plotY(annotation.y2)

            const xSortedPoints = [
              [x1, y1],
              [x2, y2]
            ].sort((a, b) => ascending(a[0], b[0]))

            return (
              <Fragment key={`a${i}`}>
                <line
                  x1={x1}
                  x2={x2}
                  y1={y1}
                  y2={y2}
                  {...styles.annotationLine}
                  {...colorScheme.set('stroke', 'text')}
                />
                <circle
                  r='3.5'
                  cx={x1}
                  cy={y1}
                  {...colorScheme.set('stroke', 'text')}
                  {...colorScheme.set('fill', 'textInverted')}
                />
                <circle
                  r='3.5'
                  cx={x2}
                  cy={y2}
                  {...colorScheme.set('stroke', 'text')}
                  {...colorScheme.set('fill', 'textInverted')}
                />
                {annotation.label && (
                  <text
                    x={x1 + (x2 - x1) / 2}
                    y={y1 + (y2 - y1) / 2}
                    textAnchor='start'
                    dy={
                      xSortedPoints[0][1] > xSortedPoints[1][1]
                        ? '1.2em'
                        : '-0.4em'
                    }
                    {...styles.annotationText}
                    {...colorScheme.set('fill', 'text')}
                  >
                    {subsup.svg(tLabel(annotation.label))}
                  </text>
                )}
              </Fragment>
            )
          })}
          <rect
            fill='transparent'
            width={width}
            height={plotHeight}
            onMouseEnter={e => focus(e)}
            onMouseMove={e => focus(e)}
            onMouseLeave={e => blur(e)}
            ref={
              /* touch events are added via ref for { passive: false } on touchstart
               * react does not support setting passive, which defaults to true in newer browsers
               * https://github.com/facebook/react/issues/6436
               */
              hoverRectRef
            }
          />
        </svg>
        {renderHover({
          width,
          height: plotHeight,
          xFormat: xAxis.format,
          yFormat: yAxis.format
        })}
      </div>
    </>
  )
}

export const propTypes = {
  values: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number,
  heightRatio: PropTypes.number,
  x: PropTypes.string.isRequired,
  xUnit: PropTypes.string,
  xNice: PropTypes.number,
  xTicks: PropTypes.arrayOf(PropTypes.number),
  xLines: PropTypes.arrayOf(
    PropTypes.shape({
      tick: PropTypes.number.isRequired,
      label: PropTypes.string,
      base: PropTypes.bool,
      textAnchor: PropTypes.string
    }).isRequired
  ),
  xScale: PropTypes.oneOf(Object.keys(scales)),
  xNumberFormat: PropTypes.string,
  xShowValue: PropTypes.bool.isRequired,
  y: PropTypes.string.isRequired,
  yUnit: PropTypes.string,
  yNice: PropTypes.number,
  yTicks: PropTypes.arrayOf(PropTypes.number),
  yLines: PropTypes.arrayOf(
    PropTypes.shape({
      tick: PropTypes.number.isRequired,
      label: PropTypes.string,
      base: PropTypes.bool
    }).isRequired
  ),
  yScale: PropTypes.oneOf(Object.keys(scales)),
  yNumberFormat: PropTypes.string,
  yShowValue: PropTypes.bool.isRequired,
  numberFormat: PropTypes.string.isRequired,
  opacity: PropTypes.number.isRequired,
  color: PropTypes.string,
  colorLegend: PropTypes.bool,
  colorLegendValues: PropTypes.arrayOf(PropTypes.string),
  colorRange: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  colorRanges: PropTypes.shape({
    sequential3: PropTypes.array.isRequired,
    discrete: PropTypes.array.isRequired
  }).isRequired,
  colorMap: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  colorSort: sortPropType,
  size: PropTypes.string.isRequired,
  sizeRangeMax: PropTypes.number.isRequired,
  sizeUnit: PropTypes.string,
  sizeNumberFormat: PropTypes.string,
  sizeShowValue: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  inlineLabel: PropTypes.string,
  inlineLabelPosition: PropTypes.string,
  inlineSecondaryLabel: PropTypes.string,
  detail: PropTypes.string,
  tLabel: PropTypes.func.isRequired,
  description: PropTypes.string,
  paddingTop: PropTypes.number.isRequired,
  paddingRight: PropTypes.number.isRequired,
  paddingBottom: PropTypes.number.isRequired,
  paddingLeft: PropTypes.number.isRequired,
  tooltipLabel: PropTypes.string,
  tooltipBody: PropTypes.string,
  annotations: PropTypes.arrayOf(
    PropTypes.shape({
      x1: PropTypes.string,
      x2: PropTypes.string,
      y1: PropTypes.string,
      y2: PropTypes.string,
      label: PropTypes.string,
      hideCircles: PropTypes.bool
    }).isRequired
  ).isRequired
}

ScatterPlot.defaultProps = {
  x: 'value',
  y: 'value',
  xScale: 'linear',
  xShowValue: true,
  yScale: 'linear',
  yShowValue: true,
  opacity: 1,
  numberFormat: 's',
  colorLegend: true,
  paddingTop: 15,
  paddingRight: 1,
  paddingBottom: 50,
  paddingLeft: 30,
  size: 'size',
  sizeRangeMax: 4,
  label: 'label',
  heightRatio: 1,
  sizeShowValue: false,
  annotations: []
}

ScatterPlot.propTypes = propTypes

export default ScatterPlot
