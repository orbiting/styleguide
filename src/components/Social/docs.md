A `<Tweet />` features Twitter content interspersed into the main editorial content.

Supported props:
- `url`: The URL of the tweet.
- `userProfileImageUrl`: The URL of the author's profile image.
- `userName`: The full author name on Twitter.
- `userScreenName`: The Twitter userScreenName (with or without @).
- `date`: The date of the tweet.
- `image`: The optional URL of an image associated with the content.
- `more`: A string indicating that there are more media elements available.
- `playable`: Whether the featured media element is playable (i.e. a video or animated GIF).


```react
<Tweet
  url='https://twitter.com/RepublikMagazin/status/869979987276742656'
  userProfileImageUrl='/static/profilePicture1.png'
  userName='Christof Moser'
  userScreenName='@christof_moser'
  date={new Date(2017, 11, 15)}
  html='One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections. <a href=\"https://twitter.com/RepublikMagazin/status/869979987276742656\" target=\"_blank\" rel=\"noopener noreferrer\">twitter.com/RepublikMagazin/status/869979987276742656</a>'
/>
```


```react
<Tweet
  url='https://twitter.com/RepublikMagazin/status/869979987276742656'
  userProfileImageUrl='/static/profilePicture1.png'
  userName='Christof Moser'
  userScreenName='christof_moser'
  date={new Date(2017, 11, 15)}
  image='/static/landscape.jpg'
  html='One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections.'
  more='2 weitere Fotos'
/>
```

```react
<Tweet
  url='https://twitter.com/RepublikMagazin/status/869979987276742656'
  userProfileImageUrl='/static/profilePicture1.png'
  userName='Christof Moser'
  userScreenName='christof_moser'
  date={new Date(2017, 11, 15)}
  image='/static/landscape.jpg'
  html='One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections.'
  playable
/>
```


### `<Tweet />` in context

```react
<Center>
  <Editorial.P>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores.</Editorial.P>
  <Tweet
    url='https://twitter.com/RepublikMagazin/status/869979987276742656'
    userProfileImageUrl='/static/profilePicture1.png'
    userName='Christof Moser'
    userScreenName='christof_moser'
    date={new Date(2017, 11, 15)}
    html='One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections.'
/>
  <Editorial.P>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores.</Editorial.P>
</Center>
```

```react
<Center>
  <Editorial.P>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores.</Editorial.P>
  <Tweet
    url='https://twitter.com/RepublikMagazin/status/869979987276742656'
    userProfileImageUrl='/static/profilePicture1.png'
    userName='Christof Moser'
    userScreenName='christof_moser'
    date={new Date(2017, 11, 15)}
    image='/static/landscape.jpg'
    html='One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections.'
/>
  <Editorial.P>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores.</Editorial.P>
</Center>
```
