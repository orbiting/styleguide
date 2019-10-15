import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import partition from 'lodash/partition'
import ColorLegend from './ColorLegend'

import {
  sansSerifMedium12,
  sansSerifMedium14,
  sansSerifRegular12,
  sansSerifRegular14,
} from '../Typography/styles'
import { onlyS } from '../../theme/mediaQueries'
import colors from '../../theme/colors'

import { arc as d3arc } from 'd3-shape'
import { getTextColor } from './utils'

const styles = {
  axis: css({
    ...sansSerifMedium12,
    fill: colors.lightText,
  }),
  labelStrong: css({
    ...sansSerifMedium14,
    [onlyS]: {
      ...sansSerifMedium12,
    },
  }),
  label: css({
    ...sansSerifRegular14,
    [onlyS]: {
      ...sansSerifRegular12,
    },
  }),
}

const arc = d3arc()

const APERTURE = Math.PI

const calcSectorAngles = (vals = []) => {
  const total = vals.reduce((acc, cur) => acc + Number(cur.value), 0)
  return vals.reduce((acc, cur, i) => {
    const deltaAngle = (APERTURE / total) * cur.value
    const startAngle = acc[i - 1] ? acc[i - 1][1] : -APERTURE / 2
    const endAngle = startAngle + deltaAngle
    acc.push([startAngle, endAngle, cur.label])
    return acc
  }, [])
}

const Hemicycle = ({
  values,
  width,
  unit,
  inlineLabelThreshold,
  padding,
  group,
  color,
  colorMaps,
  colorMap,
}) => {
  const margins = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }

  const legendColorMap =
    typeof colorMap === 'string' ? colorMaps[colorMap] : colorMap

  const labelheight = 18
  const height = width * 0.5 + 3 * labelheight
  const sidePadding = height * 0.03 * padding
  const w = width - margins.left - margins.right - sidePadding
  const h = height - margins.top - margins.bottom

  const primaryGroup = values[0][group]
  const [primaryVals, secondaryVals] = partition(
    values,
    v => v[group] === primaryGroup,
  )
  const secondaryGroup =
    secondaryVals.length > 0 && secondaryVals[0][group]
  const primaryValsTotal = primaryVals.reduce(
    (acc, cur) => acc + Number(cur.value),
    0,
  )

  const primaryAngles = calcSectorAngles(primaryVals)
  const secondaryAngles = calcSectorAngles(secondaryVals)

  const hemicycleWidth = w
  const hemicycleHeight = hemicycleWidth / 2
  // const sizeUnit = hemicycleHeight/30

  return (
    <div>
      <svg height={height - sidePadding / 2} width={width}>
        <rect width={width} height={height} fill={'#fff'} />
        <line
          x1={0.5 * width}
          x2={0.5 * width}
          y1={0}
          y2={h * 1.05 - hemicycleWidth * 0.25 - sidePadding / 2}
          stroke={'rgba(0,0,0,0.17)'}
        />
        <text
          {...styles.axis}
          x={0.5 * width + 5}
          y={5}
          alignmentBaseline="hanging"
        >
          Absolutes Mehr
        </text>
        <g
          transform={`translate(${margins.left +
            sidePadding / 2},${margins.top - sidePadding / 2})`}
        >
          <g transform={`translate(${w / 2},${h - labelheight})`}>
            {primaryAngles.map(d => {
              const datum = primaryVals.find(g => g.label === d[2])
              const fill = legendColorMap[datum[color].toUpperCase()]
              return (
                <>
                  <path
                    fill={fill}
                    d={arc({
                      outerRadius: hemicycleHeight,
                      innerRadius: hemicycleHeight / 2,
                      startAngle: d[0],
                      endAngle: d[1] + 0.001,
                    })}
                  />
                </>
              )
            })}
            {primaryAngles
              .filter(
                (d, i) =>
                  primaryVals[i].value >= inlineLabelThreshold,
              )
              .map(d => {
                const isMajorParty =
                  Math.abs(d[1] - d[0]) > APERTURE / 10
                const datum = primaryVals.find(g => g.label === d[2])
                const fill =
                  legendColorMap[datum[color].toUpperCase()]
                const x =
                  hemicycleHeight *
                  (isMajorParty ? 0.75 : 1.08) *
                  Math.sin((d[0] + d[1]) / 2)
                const y =
                  -hemicycleHeight *
                  (isMajorParty ? 0.75 : 1.1) *
                  Math.cos((d[0] + d[1]) / 2)
                const textAnchor =
                  isMajorParty || Math.abs(d[0] + d[1] / 2) < 0.5
                    ? 'middle'
                    : d[0] < 0
                    ? 'end'
                    : 'start'

                return (
                  <g transform={`translate(${x},${y})`}>
                    <text
                      {...styles.label}
                      x={0}
                      y={0}
                      textAnchor={textAnchor}
                      alignmentBaseline="middle"
                      fill={
                        isMajorParty ? getTextColor(fill) : '#000'
                      }
                    >
                      {d[2]}
                    </text>
                    <text
                      {...styles.label}
                      x={0}
                      y={labelheight}
                      textAnchor={textAnchor}
                      fill={
                        isMajorParty ? getTextColor(fill) : '#000'
                      }
                    >
                      {datum.value}
                    </text>
                  </g>
                )
              })}
            {secondaryAngles.map(d => {
              const datum = secondaryVals.find(g => g.label === d[2])
              const fill = legendColorMap[datum[color].toUpperCase()]
              return (
                <>
                  <path
                    fill={fill}
                    d={arc({
                      outerRadius: hemicycleWidth * 0.2,
                      innerRadius: hemicycleWidth * 0.15,
                      startAngle: d[0],
                      endAngle: d[1] + 0.001,
                    })}
                  />
                </>
              )
            })}
          </g>
          <text
            {...styles.labelStrong}
            x={0}
            y={h}
            textAnchor="start"
          >
            {primaryGroup}
          </text>
          <text
            {...styles.labelStrong}
            x={hemicycleWidth * 0.3}
            y={h}
            textAnchor="start"
          >
            {secondaryGroup}
          </text>
          <text
            {...styles.label}
            x={hemicycleWidth / 2}
            y={h - 1.7 * labelheight}
            textAnchor="middle"
          >
            {`${primaryValsTotal} ${unit}`}
          </text>
        </g>
      </svg>
      <div style={{ width, marginTop: 5 }}>
        <ColorLegend
          inline
          values={primaryVals
            .filter(v => v.value < inlineLabelThreshold)
            .map(v => ({
              color: legendColorMap[v[color].toUpperCase()],
              label: `${v.label}: ${v.value}`,
            }))}
        />
      </div>
    </div>
  )
}

Hemicycle.propTypes = {
  width: PropTypes.number.isRequired,
  unit: PropTypes.string,
  padding: PropTypes.number,
  inlineLabelThreshold: PropTypes.number,
  group: PropTypes.string,
  color: PropTypes.string,
  colorMap: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  colorMaps: PropTypes.object.isRequired,
  values: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    }),
  ).isRequired,
}

Hemicycle.defaultProps = {
  color: 'label',
  group: 'year',
  unit: 'Sitze',
  values: [],
  inlineLabelThreshold: 10,
  padding: 0,
  colorMap: 'swissPartyColors',
}

export default Hemicycle
