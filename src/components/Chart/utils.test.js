import test from 'tape'
import { calculateAxis } from './utils'

const tLabel = identity => identity

test('calculateAxis with round ticks', assert => {
  const yAxis = calculateAxis('.2f', tLabel, [99.34, 2507.3], 'Meter', {
    ticks: [100, 500, 1000, 2000]
  })

  assert.equal(
    yAxis.format(99.34),
    '99,34',
    'format with two decimal digits'
  )
  assert.equal(
    yAxis.axisFormat(100),
    '100',
    'no unnecessary acis decimal digits'
  )
  assert.equal(
    yAxis.axisFormat(2000, true),
    '2000 Meter',
    'include unit for last tick'
  )
  assert.end()
})

test('calculateAxis with uneven ticks', assert => {
  const yAxis = calculateAxis('.1f', tLabel, [70, 85], 'Jahre')

  assert.equal(
    yAxis.format(80.57),
    '80,6',
    'format with one decimal digit'
  )
  assert.deepEqual(
    yAxis.ticks,
    [70,77.5,85],
    'auto ticks'
  )
  assert.deepEqual(
    yAxis.axisFormat(77.5),
    '77,5',
    'axis fromat with one decimal digit'
  )
  assert.equal(
    yAxis.axisFormat(85, true),
    '85,0 Jahre',
    'include unit for last tick'
  )
  assert.end()
})
