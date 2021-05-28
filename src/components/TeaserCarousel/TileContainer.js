import React, { useContext } from 'react'

import CarouselContext from './Context'
import Grid from './Grid'
import Row from './Row'

const Container = ({ initialScrollTile, children, height, style }) => {
  const context = useContext(CarouselContext)
  if (context.grid) {
    return (
      <Grid initialScrollTile={initialScrollTile} height={height}>
        {children}
      </Grid>
    )
  }
  return (
    <Row initialScrollTile={initialScrollTile} style={style}>
      {children}
    </Row>
  )
}

export default Container
