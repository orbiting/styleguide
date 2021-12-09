import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import { useColorContext } from '../Colors/useColorContext'
import { ChartContext } from './ChartContext'
import LineGroup from './LineGroup'
import XAxis from './XAxis'
import { defaultProps } from './ChartContext'

import {
  sansSerifMedium12 as VALUE_FONT,
  sansSerifRegular12 as LABEL_FONT,
  sansSerifMedium12,
  sansSerifMedium14,
  sansSerifMedium22
} from '../Typography/styles'

import { X_UNIT_PADDING } from './Layout.constants'

import { yScales } from './Lines.utils'

import { sortPropType, xAccessor } from './utils'

import ColorLegend from './ColorLegend'

const styles = {
  columnTitle: css({
    ...sansSerifMedium14
  }),
  axisLabel: css({
    ...LABEL_FONT
  }),
  axisYLine: css({
    strokeWidth: '1px',
    shapeRendering: 'crispEdges'
  }),
  axisXLine: css({
    strokeWidth: '1px',
    shapeRendering: 'crispEdges'
  }),
  annotationLine: css({
    strokeWidth: '1px',
    fillRule: 'evenodd',
    strokeLinecap: 'round',
    strokeDasharray: '1,3',
    strokeLinejoin: 'round'
  }),
  annotationText: css({
    ...LABEL_FONT
  }),
  annotationValue: css({
    ...sansSerifMedium12
  }),
  value: css({
    ...VALUE_FONT
  }),
  valueMini: css({
    ...sansSerifMedium22
  }),
  label: css({
    ...LABEL_FONT
  }),
  bandLegend: css({
    ...LABEL_FONT,
    whiteSpace: 'nowrap'
  }),
  bandBar: css({
    display: 'inline-block',
    width: 24,
    height: 11,
    marginBottom: -1,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderTopStyle: 'solid',
    borderBottomStyle: 'solid'
  })
}

const LineChart = props => {
  const {
    width,
    mini,
    description,
    band,
    bandLegend,
    area,
    areaOpacity,
    endDy
  } = props

  const [colorScheme] = useColorContext()
  const chartContext = React.useContext(ChartContext)
  const {
    paddingLeft,
    paddingRight,
    yLayout,
    groupPosition,
    xAxis,
    yAxis
  } = chartContext

  const visibleColorLegendValues = []
    .concat(chartContext.colorLegendValues)
    .concat(
      !mini &&
        band &&
        bandLegend && {
          label: (
            <span {...styles.bandLegend} {...colorScheme.set('color', 'text')}>
              <span
                {...styles.bandBar}
                {...colorScheme.set('backgroundColor', 'text')}
                {...colorScheme.set('borderTopColor', 'divider')}
                {...colorScheme.set('borderBottomColor', 'divider')}
              />
              {` ${bandLegend}`}
            </span>
          )
        }
    )
    .filter(Boolean)

  return (
    <>
      <div style={{ paddingLeft, paddingRight }}>
        <ColorLegend inline values={visibleColorLegendValues} />
      </div>
      <svg
        width={width}
        height={chartContext.height + (props.xUnit ? X_UNIT_PADDING : 0)}
      >
        <desc>{description}</desc>
        {chartContext.groupedData.map(({ values: lines, key }) => {
          const filterByColumn = d => !d.column || d.column === key
          const yLines = props.yLines || yAxis.ticks.map(tick => ({ tick }))
          return (
            <g
              key={key || 1}
              transform={`translate(${groupPosition.x(key) +
                paddingLeft},${groupPosition.y(key)})`}
            >
              <LineGroup
                mini={mini}
                title={key}
                lines={lines}
                x={xAxis.scale}
                xAccessor={xAccessor}
                y={yAxis.scale}
                yTicks={yAxis.ticks}
                yLines={yLines.filter(filterByColumn)}
                yAxisFormat={yAxis.axisFormat}
                band={band}
                area={area}
                areaOpacity={areaOpacity}
                yCut={yLayout.yCut}
                yCutHeight={yLayout.yCutHeight}
                yConnectorSize={yLayout.yConnectorSize}
                yNeedsConnectors={yLayout.yNeedsConnectors}
                yAnnotations={chartContext.yAnnotations.filter(filterByColumn)}
                xAnnotations={chartContext.xAnnotations.filter(filterByColumn)}
                endDy={endDy}
                width={chartContext.innerWidth}
                paddingRight={paddingRight}
                xAxisElement={
                  <XAxis
                    xUnit={props.xUnit}
                    lines={props.xLines?.filter(filterByColumn)}
                    type={props.type}
                  />
                }
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
  width: PropTypes.number.isRequired,
  mini: PropTypes.bool,
  x: PropTypes.string.isRequired,
  xUnit: PropTypes.string,
  xScale: PropTypes.oneOf(['time', 'ordinal', 'linear']),
  xNumberFormat: PropTypes.string,
  xSort: sortPropType,
  xTicks: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  xLines: PropTypes.arrayOf(
    PropTypes.shape({
      column: PropTypes.string,
      tick: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string,
      textAnchor: PropTypes.string
    }).isRequired
  ),
  yScale: PropTypes.oneOf(Object.keys(yScales)),
  timeParse: PropTypes.string.isRequired,
  timeFormat: PropTypes.string.isRequired,
  column: PropTypes.string,
  columnSort: sortPropType,
  columnFilter: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      test: PropTypes.string.isRequired
    })
  ),
  highlight: PropTypes.string,
  stroke: PropTypes.string,
  labelFilter: PropTypes.string,
  color: PropTypes.string,
  colorSort: sortPropType,
  colorRange: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  colorRanges: PropTypes.shape({
    sequential3: PropTypes.array.isRequired,
    discrete: PropTypes.array.isRequired
  }).isRequired,
  colorMap: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  colorLegend: PropTypes.bool,
  colorLegendValues: PropTypes.arrayOf(PropTypes.string),
  category: PropTypes.string,
  areaOpacity: PropTypes.number,
  area: PropTypes.string,
  band: PropTypes.string,
  bandLegend: PropTypes.string,
  numberFormat: PropTypes.string.isRequired,
  zero: PropTypes.bool.isRequired,
  filter: PropTypes.string,
  startValue: PropTypes.bool.isRequired,
  endLabel: PropTypes.bool.isRequired,
  endLabelWidth: PropTypes.number,
  endDy: PropTypes.string.isRequired,
  minInnerWidth: PropTypes.number.isRequired,
  columns: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  paddingTop: PropTypes.number,
  paddingRight: PropTypes.number,
  paddingLeft: PropTypes.number,
  unit: PropTypes.string,
  yNice: PropTypes.number,
  yTicks: PropTypes.arrayOf(PropTypes.number),
  yLines: PropTypes.arrayOf(
    PropTypes.shape({
      column: PropTypes.string,
      tick: PropTypes.number.isRequired,
      label: PropTypes.string,
      base: PropTypes.bool
    }).isRequired
  ),
  yAnnotations: PropTypes.arrayOf(
    PropTypes.shape({
      column: PropTypes.string,
      value: PropTypes.number.isRequired,
      unit: PropTypes.string,
      label: PropTypes.string,
      x: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      dy: PropTypes.string,
      showValue: PropTypes.bool
    })
  ),
  xAnnotations: PropTypes.arrayOf(
    PropTypes.shape({
      column: PropTypes.string,
      valuePrefix: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      unit: PropTypes.string,
      label: PropTypes.string,
      x: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      x1: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      x2: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      position: PropTypes.oneOf(['top', 'bottom']),
      showValue: PropTypes.bool
    })
  ),
  tLabel: PropTypes.func.isRequired,
  description: PropTypes.string
}

LineChart.propTypes = propTypes

export const Line = props => <LineChart {...props} />

Line.defaultProps = defaultProps.Line

export const lineEditorSchema = ({
  fields,
  defaults,
  numberFormats,
  timeFormats,
  colorDropdownItems,
  xScaleTypes,
  yScaleTypes,
  sortingOptions
}) => {
  return {
    title: 'LineChartConfig',
    type: 'object',
    properties: {
      basic: {
        xAxis: {
          title: 'Horizontale Achse',
          properties: {
            x: {
              title: 'Spalte auswählen',
              type: 'string',
              enum: fields,
              default: defaults.x
            },
            timeFormat: {
              title: 'Datumsformat (Chart)',
              type: 'string',
              enum: timeFormats,
              default: defaults.timeFormat,
              format: 'dynamicDropdown',
              parent: 'xAxis',
              timeParseDefault: defaults.timeParse,
              xNumberFormatDefault: defaults.xNumberFormat
            },
            xUnit: {
              title: 'Achsenbeschriftung',
              type: 'string',
              default: defaults.xUnit || ''
            }
          }
        },
        yAxis: {
          title: 'Vertikale Achse',
          properties: {
            numberFormat: {
              title: 'Zahlenformat',
              type: 'string',
              enum: numberFormats,
              default: defaults.numberFormat,
              parent: 'yAxis'
            },
            unit: {
              title: 'Achsenbeschriftung',
              type: 'string',
              default: defaults.unit || ''
            }
          }
        },
        color: {
          title: 'Farbe',
          properties: {
            color: {
              title: 'Spalte auswählen',
              type: 'string',
              enum: fields.concat({ value: '', text: 'keine Auswahl' }),
              default: defaults.color || ''
            },
            colorRange: {
              title: 'Farbschema auswählen',
              type: 'string',
              enum: colorDropdownItems,
              default: defaults.colorRange || ''
            }
          }
        },
        layout: {
          title: 'Grid',
          properties: {
            column: {
              title: 'Spalte auswählen',
              type: 'string',
              enum: fields.concat({ value: '', text: 'keine Auswahl' }),
              default: defaults.column || ''
            },
            columns: {
              title: 'Anzahl Spalten pro Zeile:',
              type: 'number',
              default: defaults.columns
            }
          }
        }
      },
      advanced: {
        xAxis: {
          title: 'Horizontale Achse',
          properties: {
            xTicks: {
              title: 'Achsenticks',
              type: 'array',
              contains: {
                type: 'string'
              },
              default: defaults.xTicks
            },
            xScale: {
              title: 'Skala',
              type: 'string',
              enum: xScaleTypes,
              default: defaults.xScale
            }
          }
        },
        yAxis: {
          title: 'Vertikale Achse',
          properties: {
            yTicks: {
              title: 'Achsenticks',
              type: 'array',
              contains: {
                type: 'string'
              },
              default: defaults.yTicks
            },
            yScale: {
              title: 'Skala',
              type: 'string',
              enum: yScaleTypes,
              default: defaults.yScale
            },
            zero: {
              title: 'Y-Achse bei 0 beginnen',
              type: 'boolean',
              default: defaults.zero
            }
          }
        },
        layout: {
          title: 'Layout',
          properties: {
            height: {
              title: 'Höhe',
              type: 'number',
              default: defaults.height
            },
            minInnerWidth: {
              title: 'Minimale Breite',
              type: 'number',
              default: defaults.minInnerWidth
            }
          }
        },
        more: {
          title: 'Weitere Einstellungen',
          properties: {
            band: {
              title: 'Name Konfidenzinterval',
              type: 'string',
              default: defaults.band || ''
            },
            bandLegend: {
              title: 'Legende Konfidenzinterval',
              type: 'string',
              default: defaults.bandLegend || ''
            },
            endLabel: {
              title: 'Label am Linienende',
              type: 'boolean',
              default: defaults.endLabel
            },
            endValue: {
              title: 'Wert am Linienende',
              type: 'boolean',
              default: defaults.endValue
            },
            startValue: {
              title: 'Wert am Linienanfang',
              type: 'boolean',
              default: defaults.startValue
            }
          }
        }
      }
    }
  }
}

export const Slope = props => <LineChart {...props} />

Slope.defaultProps = defaultProps.Slope

export const slopeEditorSchema = ({
  fields,
  defaults,
  numberFormats,
  timeFormats,
  colorDropdownItems,
  xScaleTypes,
  yScaleTypes,
  sortingOptions
}) => {
  return {
    title: 'SlopeChartConfig',
    type: 'object',
    properties: {
      basic: {
        xAxis: {
          title: 'Horizontale Achse',
          properties: {
            x: {
              title: 'Spalte auswählen',
              type: 'string',
              enum: fields,
              default: defaults.x
            },
            timeFormat: {
              title: 'Datumsformat (Chart)',
              type: 'string',
              enum: timeFormats,
              default: defaults.timeFormat,
              format: 'dynamicDropdown',
              parent: 'xAxis',
              timeParseDefault: defaults.timeParse,
              xNumberFormatDefault: defaults.xNumberFormat
            }
          }
        },
        yAxis: {
          title: 'Vertikale Achse',
          properties: {
            numberFormat: {
              title: 'Zahlenformat',
              type: 'string',
              enum: numberFormats,
              default: defaults.numberFormat,
              parent: 'yAxis'
            },
            unit: {
              title: 'Achsenbeschriftung',
              type: 'string',
              default: defaults.unit || ''
            }
          }
        },
        color: {
          title: 'Farbe',
          properties: {
            color: {
              title: 'Spalte auswählen',
              type: 'string',
              enum: fields.concat({ value: '', text: 'keine Auswahl' }),
              default: defaults.color || ''
            },
            colorRange: {
              title: 'Farbschema auswählen',
              type: 'string',
              enum: colorDropdownItems,
              default: defaults.colorRange || ''
            }
          }
        },
        layout: {
          title: 'Grid',
          properties: {
            column: {
              title: 'Spalte auswählen',
              type: 'string',
              enum: fields.concat({ value: '', text: 'keine Auswahl' }),
              default: defaults.column || ''
            },
            columns: {
              title: 'Anzahl Spalten pro Zeile:',
              type: 'number',
              default: defaults.columns
            }
          }
        }
      },
      advanced: {
        xAxis: {
          title: 'Horizontale Achse',
          properties: {
            xScale: {
              title: 'Skala',
              type: 'string',
              enum: xScaleTypes,
              default: defaults.xScale
            }
          }
        },
        yAxis: {
          title: 'Vertikale Achse',
          properties: {
            yScale: {
              title: 'Skala',
              type: 'string',
              enum: yScaleTypes,
              default: defaults.yScale
            },
            zero: {
              title: 'Y-Achse bei 0 beginnen',
              type: 'boolean',
              default: defaults.zero
            }
          }
        },
        layout: {
          title: 'Layout',
          properties: {
            height: {
              title: 'Höhe',
              type: 'number',
              default: defaults.height
            },
            minInnerWidth: {
              title: 'Minimale Breite',
              type: 'number',
              default: defaults.minInnerWidth
            }
          }
        },
        more: {
          title: 'Weitere Einstellungen',
          properties: {
            endLabel: {
              title: 'Label am Linienende',
              type: 'boolean',
              default: defaults.endLabel
            },
            endValue: {
              title: 'Wert am Linienende',
              type: 'boolean',
              default: defaults.endValue
            },
            startValue: {
              title: 'Wert am Linienanfang',
              type: 'boolean',
              default: defaults.startValue
            }
          }
        }
      }
    }
  }
}

// Additional Info for Docs
// - Slope just has different default props
Slope.base = 'Line'
