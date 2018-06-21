import React from 'react'
import { storiesOf } from '@storybook/react'
import { withState } from '@dump247/storybook-state'


import { FigureCaption, FigureByline } from "../Figure"
import Gallery from './Gallery'

const items = [
  {
    mediaItem: <img src='/static/landscape.jpg' />,
    captionItem: <FigureCaption>One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections. The bedding was hardly able to cover it and seemed ready to slide off any moment. <FigureByline>Photo: Laurent Burst</FigureByline></FigureCaption>,
  },
  {
    mediaItem: <img src='/static/rothaus_portrait.jpg' />,
    captionItem: <FigureCaption>One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly.<FigureByline>Photo: Laurent Burst</FigureByline></FigureCaption>,
  },
  {
    mediaItem: <img src='https://assets.republik.ch/images/pierre_rom.jpeg' />,
    captionItem: <FigureCaption>One morning, when Gregor Samsa woke from troubled dreams.<FigureByline>Photo: Laurentine Verylong Burst</FigureByline></FigureCaption>,
  }
]

storiesOf('Gallery', module)
  .add('default', withState({ showGallery: false, startItem: 0 })(({ store }) =>
    <div style={{ 
      position: store.state.showGallery ? 'fixed' : 'relative', 
      overflow: store.state.showGallery ? 'hidden' : 'auto' 
    }}>
      {
        items.map((item, i) =>
          <div style={{ width: '50%', margin: 'auto' }}>
            { React.cloneElement(item.mediaItem, {key: i, style: { width: '100%' }, onClick: () => store.set({ showGallery: true, startItem: i })}) }
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