import React from 'react'
import { storiesOf } from '@storybook/react'
import { withState } from '@dump247/storybook-state'

import { FigureImage } from "../Figure"
import Gallery from './Gallery'

const items = [
  {
    src: '/static/landscape.jpg',
    caption: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligulaeget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturientmontes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesqueeu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo,fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut,imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium.Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputateeleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac,enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellusviverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiamultricies nisi vel augue.',
    credit: 'Laurent Burst'
  },
  {
    src: '/static/rothaus_portrait.jpg',
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
          <div style={{ width: '50%', margin: 'auto' }} onClick={() => store.set({ showGallery: true, startItem: i })}>
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