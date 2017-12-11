A `<TeaserFrontImage />` is a front page teaser that features text on top of an image on wide screens, and stacks the text under the image on narrow screens.

Supported props:
- `image`: The URL of image.
- `textPosition`: `topleft` (default), `topright`, `bottomleft` or `bottomright`.
- `color`: The text color.
- `bgColor`: The background color to use in stacked mode.
- `center`: Whether the text should be center aligned.

A `<TeaserFrontImageHeadline />` should be used.

```react
<TeaserFrontImage
  image='/static/desert.jpg'
  color='#fff' bgColor='#000'>
  <Editorial.Format>Neutrum</Editorial.Format>
  <TeaserFrontImageHeadline.Editorial>The sand is near</TeaserFrontImageHeadline.Editorial>
  <TeaserFrontLead>
    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor.
  </TeaserFrontLead>
  <TeaserFrontCredit>
    An article by <TeaserFrontCreditLink href='#' color='#adf'>Christof Moser</TeaserFrontCreditLink>, 31 December 2017
  </TeaserFrontCredit>
</TeaserFrontImage>
```

```react
<TeaserFrontImage image='/static/desert.jpg'
  textPosition='topright'
  color='#fff' bgColor='#000'>
  <Editorial.Format>Neutrum</Editorial.Format>
  <TeaserFrontImageHeadline.Editorial>The sand is near</TeaserFrontImageHeadline.Editorial>
  <TeaserFrontLead>
    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor.
  </TeaserFrontLead>
  <TeaserFrontCredit>
    An article by <TeaserFrontCreditLink href='#' color='#adf'>Christof Moser</TeaserFrontCreditLink>, 31 December 2017
  </TeaserFrontCredit>
</TeaserFrontImage>
```

```react
<TeaserFrontImage image='/static/desert.jpg'
  textPosition='bottomleft'
  color='#fff' bgColor='#000'>
  <Editorial.Format>Neutrum</Editorial.Format>
  <TeaserFrontImageHeadline.Editorial>The sand</TeaserFrontImageHeadline.Editorial>
  <TeaserFrontLead>
    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor.
  </TeaserFrontLead>
  <TeaserFrontCredit>
    An article by <TeaserFrontCreditLink href='#' color='#adf'>Christof Moser</TeaserFrontCreditLink>, 31 December 2017
  </TeaserFrontCredit>
</TeaserFrontImage>
```

```react
<TeaserFrontImage image='/static/desert.jpg'
  textPosition='bottomright'
  color='#fff' bgColor='#000'>
  <Editorial.Format>Neutrum</Editorial.Format>
  <TeaserFrontImageHeadline.Editorial>The sand</TeaserFrontImageHeadline.Editorial>
  <TeaserFrontLead>
    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor.
  </TeaserFrontLead>
  <TeaserFrontCredit>
    An article by <TeaserFrontCreditLink href='#' color='#adf'>Christof Moser</TeaserFrontCreditLink>, 31 December 2017
  </TeaserFrontCredit>
</TeaserFrontImage>
```

```react
<TeaserFrontImage image='/static/desert.jpg'
  center
  textPosition='topright' 
  color='#fff' bgColor='#000'>
  <Editorial.Format>Neutrum</Editorial.Format>
  <TeaserFrontImageHeadline.Editorial>The sand is near</TeaserFrontImageHeadline.Editorial>
  <TeaserFrontLead>
    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor.
  </TeaserFrontLead>
  <TeaserFrontCredit>
    An article by <TeaserFrontCreditLink href='#' color='#adf'>Christof Moser</TeaserFrontCreditLink>, 31 December 2017
  </TeaserFrontCredit>
</TeaserFrontImage>
```

```react
<TeaserFrontImage image='/static/desert.jpg'
  textPosition='topright'
  color='#fff' bgColor='#000'>
  <Editorial.Format>Neutrum</Editorial.Format>
  <TeaserFrontImageHeadline.Interaction>The sand is near</TeaserFrontImageHeadline.Interaction>
  <TeaserFrontLead>
    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor.
  </TeaserFrontLead>
  <TeaserFrontCredit>
    An article by <TeaserFrontCreditLink href='#' color='#adf'>Christof Moser</TeaserFrontCreditLink>, 31 December 2017
  </TeaserFrontCredit>
</TeaserFrontImage>
```

Photo by Thomas Vuillemin on [Unsplash](https://unsplash.com/photos/c1_K8Qfd_iQ)
