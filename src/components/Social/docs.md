A `<SocialEmbed />` features social media content interspersed into the main editorial content.

Supported props:
- `platform`: `twitter` (default) or `facebook`
- `url`: The URL of the content on the social media platform.
- `profilePicture`: The URL of the author's profile picture.
- `authorName`: The full author name.
- `subline`: The line to render underneath the author name.
- `image`: The optional URL of an image associated with the content.


```react
<SocialEmbed
  platform='twitter'
  url='https://twitter.com/RepublikMagazin/status/869979987276742656'
  profilePicture='/static/profilePicture1.png'
  authorName='Christof Moser'
  subline='@ChristofMoser, 15. November 2017'
>
  One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections.
</SocialEmbed>
```

```react
<SocialEmbed
  platform='facebook'
  url='https://www.facebook.com/RepublikMagazin/posts/2051780445108596'
  profilePicture='/static/profilePicture1.png'
  authorName='Christof Moser'
  subline='15. November 2017'
>
  One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections.
</SocialEmbed>
```


```react
<SocialEmbed
  platform='twitter'
  url='https://twitter.com/RepublikMagazin/status/869979987276742656'
  profilePicture='/static/profilePicture1.png'
  authorName='Christof Moser'
  subline='@ChristofMoser, 15. November 2017'
  image='/static/landscape.jpg'
>
  One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections.
</SocialEmbed>
```


### `<SocialEmbed />` in context

```react
<Center>
  <Editorial.P>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores.</Editorial.P>
  <SocialEmbed
    platform='twitter'
    url='https://twitter.com/RepublikMagazin/status/869979987276742656'
    profilePicture='/static/profilePicture1.png'
    authorName='Christof Moser'
    subline='@ChristofMoser, 15. November 2017'
>
  One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections.
</SocialEmbed>
  <Editorial.P>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores.</Editorial.P>
</Center>
```

```react
<Center>
  <Editorial.P>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores.</Editorial.P>
  <SocialEmbed
    platform='twitter'
    url='https://twitter.com/RepublikMagazin/status/869979987276742656'
    profilePicture='/static/profilePicture1.png'
    authorName='Christof Moser'
    subline='@ChristofMoser, 15. November 2017'
    image='/static/landscape.jpg'
>
  One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections.
</SocialEmbed>
  <Editorial.P>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores.</Editorial.P>
</Center>
```
