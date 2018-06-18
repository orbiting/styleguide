import React from 'react'
import { storiesOf } from '@storybook/react'
import { withState } from '@dump247/storybook-state'

import Button from './';

storiesOf('Button.story', module)
  .add('default',  withState({ clicked: 0 })(({ store }) =>
    <Button onClick={() => store.set({ clicked: store.state.clicked+1 })}>
      Clicked {store.state.clicked} times
    </Button>
  )
)