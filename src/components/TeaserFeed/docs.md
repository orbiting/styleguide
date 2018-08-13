A `<TeaserFeed />` is a concise article teaser used in a feed context.

Supported props:
- `format`: An optional format which appears on top of the headline.
- `kind`: String `meta` or `editorial` (default)
- `color`: Color for top border and title
- `Link`, a Next.js like `<Link />` component
  This will be wrapped around links. You should attach an `onClick` handler within, if you wish to do client side routing and or prefetching. The component recieves following props:
  - `href` String, target url or path
  - `passHref` Boolean, indicates this will eventually end in an a tag and you may overwrite href

```react
<TeaserFeed
  title='The quick brown fox jumps over the lazy dog'
  description='Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores.'
  credits={[
    {type: 'text', value: 'An article by '},
    {type: 'link', url: 'https://republik.ch/~moser', children: [{type: 'text', value: 'Christof Moser'}]},
    {type: 'text', value: ', 31.12.2017'},
  ]} />
```

```react
<TeaserFeed format={{meta: {title: 'Format'}}}
  title='The quick brown fox jumps over the lazy dog'
  description='Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores.'
  credits={[
    {type: 'text', value: 'An article by '},
    {type: 'link', url: 'https://republik.ch/~moser', children: [{type: 'text', value: 'Christof Moser'}]},
    {type: 'text', value: ', 31.12.2017'},
  ]} />
```

```react
<TeaserFeed kind='editorial' format={{meta: {title: 'Format'}}}
  title='The quick brown fox jumps over the lazy dog'
  description='Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores.'
  publishDate='2017-12-31T11:34:00.000Z' />
```


```react
<TeaserFeed kind='meta' format={{meta: {title: 'Format'}}}
  title='The quick brown fox jumps over the lazy dog'
  description='Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores.'
  credits={[
    {type: 'text', value: 'An article by '},
    {type: 'link', url: 'https://republik.ch/~moser', children: [{type: 'text', value: 'Christof Moser'}]},
    {type: 'text', value: ', 31.12.2017'},
  ]} />
```

```react
<TeaserFeed format={{meta: {title: 'Format', color: 'purple', kind: 'meta'}}}
  title='The quick brown fox jumps over the lazy dog'
  description='Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores.'
  credits={[
    {type: 'text', value: 'An article by '},
    {type: 'link', url: 'https://republik.ch/~moser', children: [{type: 'text', value: 'Christof Moser'}]},
    {type: 'text', value: ', 31.12.2017'},
  ]} />
```

```react
<TeaserFeed kind='scribble'
  title='The quick brown fox jumps over the lazy dog'
  description='Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores.'
  credits={[
    {type: 'text', value: 'An article by '},
    {type: 'link', url: 'https://republik.ch/~moser', children: [{type: 'text', value: 'Christof Moser'}]},
    {type: 'text', value: ', 31.12.2017'},
  ]} />
```

```react
<TeaserFeed format={{meta: {title: 'Format', kind: 'scribble'}}}
  title='The quick brown fox jumps over the lazy dog'
  description='Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores.'
  credits={[
    {type: 'text', value: 'An article by '},
    {type: 'link', url: 'https://republik.ch/~moser', children: [{type: 'text', value: 'Christof Moser'}]},
    {type: 'text', value: ', 31.12.2017'},
  ]} />
```
