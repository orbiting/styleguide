import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import Button from './';

storiesOf('Button.story', module)
  .add('default', () =>
    <Button>
      Click Me!
    </Button>
  )