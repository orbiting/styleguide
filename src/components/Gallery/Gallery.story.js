import React from 'react'
import { storiesOf } from '@storybook/react'
import { withState } from '@dump247/storybook-state'

import { FigureImage } from "../Figure"
import Gallery from './Gallery'

const items = [
  {
    src: 'https://cdn.republik.space/s3/republik-assets/github/republik/article-alles-neu-macht-der-mai/images/8928972a492684c9dcbdb7265b54f007f85a868a.jpeg.webp?size=3457x2205&resize=1200x',
    caption: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligulaeget dolor. Aenean massa. Cum sociis natoque penatibus et .',
    credit: 'Laurent Burst'
  },
  {
    src: 'https://cdn.republik.space/s3/republik-assets/github/republik/article-alles-neu-macht-der-mai/images/f754afb50f402164e143436bcfd7dea5cc7d8ebb.jpeg.webp?size=3307x2291&resize=665x',
    caption: 'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly.',
    credit: 'Laurent Burst'
  },
  {
    src: 'https://assets.republik.ch/images/pierre_rom.jpeg',
    caption: 'One morning, when Gregor Samsa woke from troubled dreams.',
    credit: 'Laurentine Verylong Burst'
  },
]

storiesOf('Gallery', module)
  .add('default', withState({ showGallery: false, startItem: 0 })(({ store }) =>
    <div style={{ 
      position: store.state.showGallery ? 'fixed' : 'relative', 
      overflow: store.state.showGallery ? 'hidden' : 'auto' 
    }}>
      {
        items.map((item, i) =>
          <div style={{ width: '50%', margin: 'auto', marginBottom: 30 }} onClick={() => store.set({ showGallery: true, startItem: i })}>
            <FigureImage key={i} src={item.src} />
          </div>
        )
      }
      { store.state.showGallery &&
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}>
          <Gallery  
            items={items}
            startItem={store.state.startItem}
            onClose={() => store.set({ showGallery: false })}
          />
        </div>
      }
    </div>
  )
)