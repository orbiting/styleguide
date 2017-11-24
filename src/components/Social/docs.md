A `<Tweet />` features social media content interspersed into the main editorial content.

Supported props:
- `platform`: `twitter` (default) or `facebook`
- `url`: The URL of the content on the social media platform.
- `profilePicture`: The URL of the author's profile picture.
- `name`: The full author name.
- `handle`: The line to render underneath the author name.
- `image`: The optional URL of an image associated with the content.


```react
<Tweet
  url='https://twitter.com/RepublikMagazin/status/869979987276742656'
  profilePicture='/static/profilePicture1.png'
  name='Christof Moser'
  handle='@christof_moser'
  date='15. November 2017'
>
  One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections.
</Tweet>
```


```react
<Tweet
  url='https://twitter.com/RepublikMagazin/status/869979987276742656'
  profilePicture='/static/profilePicture1.png'
  name='Christof Moser'
  handle='christof_moser'
  date='15. November 2017'
  image='/static/landscape.jpg'
>
  One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections.
</Tweet>
```


### `<Tweet />` in context

```react
<Center>
  <Editorial.P>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores.</Editorial.P>
  <Tweet
    url='https://twitter.com/RepublikMagazin/status/869979987276742656'
    profilePicture='/static/profilePicture1.png'
    name='Christof Moser'
    handle='christof_moser'
    date='15. November 2017'
>
  One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections.
</Tweet>
  <Editorial.P>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores.</Editorial.P>
</Center>
```

```react
<Center>
  <Editorial.P>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores.</Editorial.P>
  <Tweet
    url='https://twitter.com/RepublikMagazin/status/869979987276742656'
    profilePicture='/static/profilePicture1.png'
    name='Christof Moser'
    handle='christof_moser'
    date='15. November 2017'
    image='/static/landscape.jpg'
>
  One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections.
</Tweet>
  <Editorial.P>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores.</Editorial.P>
</Center>
```
