A `<TeaserFrontSplit />` is a front page teaser that features text and image side by side.

Supported props:
- `image`: The URL of image.
- `color`: The text color.
- `bgColor`: The background color to use in stacked mode.
- `portrait`: Whether to use the portrait layout.
- `reverse`: Whether the layout should be reversed (i.e. the image appears to the right).
- `frame`: Whether to use the canonical frame margins.

A `<TeaserFrontSplitHeadline />` should be used.

```react
<TeaserFrontSplit
  even
  image='/static/rothaus_portrait.jpg'
  byline='Foto: Laurent Burst'
  color='#fff' bgColor='#000'>
  <Editorial.Format>Neutrum</Editorial.Format>
  <TeaserFrontSplitHeadline.Editorial>Es ist kalt in Österreich</TeaserFrontSplitHeadline.Editorial>
  <TeaserFrontLead>
    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor.
  </TeaserFrontLead>
  <TeaserFrontCredit>
    An article by <TeaserFrontCreditLink href='#' color='#fba'>Christof Moser</TeaserFrontCreditLink>, 31 December 2017
  </TeaserFrontCredit>
</TeaserFrontSplit>
```

```react
<TeaserFrontSplit
  even
  image='/static/rothaus_portrait.jpg'
  reverse
  byline='Foto: Laurent Burst'
  color='#fff' bgColor='#000'>
  <Editorial.Format>Neutrum</Editorial.Format>
  <TeaserFrontSplitHeadline.Editorial>Es ist kalt in Österreich</TeaserFrontSplitHeadline.Editorial>
  <TeaserFrontLead>
    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor.
  </TeaserFrontLead>
  <TeaserFrontCredit>
    An article by <TeaserFrontCreditLink href='#' color='#fba'>Christof Moser</TeaserFrontCreditLink>, 31 December 2017
  </TeaserFrontCredit>
</TeaserFrontSplit>
```

```react
<TeaserFrontSplit
  image='/static/rothaus_portrait.jpg?size=945x1331'
  portrait
  byline='Foto: Laurent Burst'
  color='#fff' bgColor='#000'>
  <Editorial.Format>Neutrum</Editorial.Format>
  <TeaserFrontSplitHeadline.Editorial>Es ist kalt in Österreich</TeaserFrontSplitHeadline.Editorial>
  <TeaserFrontLead>
    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor.
  </TeaserFrontLead>
  <TeaserFrontCredit>
    An article by <TeaserFrontCreditLink href='#' color='#fba'>Christof Moser</TeaserFrontCreditLink>, 31 December 2017
  </TeaserFrontCredit>
</TeaserFrontSplit>
```

```react
<TeaserFrontSplit
  image='/static/rothaus_portrait.jpg'
  portrait reverse
  byline='Foto: Laurent Burst'
  color='#fff' bgColor='#000'>
  <Editorial.Format>Neutrum</Editorial.Format>
  <TeaserFrontSplitHeadline.Editorial>Es ist kalt in Österreich</TeaserFrontSplitHeadline.Editorial>
  <TeaserFrontLead>
    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor.
  </TeaserFrontLead>
  <TeaserFrontCredit>
    An article by <TeaserFrontCreditLink href='#' color='#fba'>Christof Moser</TeaserFrontCreditLink>, 31 December 2017
  </TeaserFrontCredit>
</TeaserFrontSplit>
```

```react
<TeaserFrontSplit
  image='/static/rothaus_landscape.jpg'
  byline='Foto: Laurent Burst'
  color='#fff' bgColor='#000'>
  <Editorial.Format>Neutrum</Editorial.Format>
  <TeaserFrontSplitHeadline.Editorial>Es ist kalt in Österreich</TeaserFrontSplitHeadline.Editorial>
  <TeaserFrontLead>
    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor.
  </TeaserFrontLead>
  <TeaserFrontCredit>
    An article by <TeaserFrontCreditLink href='#' color='#fba'>Christof Moser</TeaserFrontCreditLink>, 31 December 2017
  </TeaserFrontCredit>
</TeaserFrontSplit>
```

```react
<TeaserFrontSplit
  image='/static/rothaus_landscape.jpg'
  reverse
  byline='Foto: Laurent Burst'
  color='#fff' bgColor='#000'>
  <Editorial.Format>Neutrum</Editorial.Format>
  <TeaserFrontSplitHeadline.Editorial>Es ist kalt in Österreich</TeaserFrontSplitHeadline.Editorial>
  <TeaserFrontLead>
    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor.
  </TeaserFrontLead>
  <TeaserFrontCredit>
    An article by <TeaserFrontCreditLink href='#' color='#fba'>Christof Moser</TeaserFrontCreditLink>, 31 December 2017
  </TeaserFrontCredit>
</TeaserFrontSplit>
```

### Medium headline

```react
<TeaserFrontSplit
  image='/static/rothaus_portrait.jpg?size=945x1331'
  portrait
  byline='Foto: Laurent Burst'
  color='#fff' bgColor='#000'>
  <Editorial.Format>Neutrum</Editorial.Format>
  <TeaserFrontSplitHeadline.Editorial medium>Es ist kalt</TeaserFrontSplitHeadline.Editorial>
  <TeaserFrontLead>
    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor.
  </TeaserFrontLead>
  <TeaserFrontCredit>
    An article by <TeaserFrontCreditLink href='#' color='#fba'>Christof Moser</TeaserFrontCreditLink>, 31 December 2017
  </TeaserFrontCredit>
</TeaserFrontSplit>
```

### Large headline

```react
<TeaserFrontSplit
  image='/static/rothaus_portrait.jpg?size=945x1331'
  portrait
  byline='Foto: Laurent Burst'
  color='#fff' bgColor='#000'>
  <Editorial.Format>Neutrum</Editorial.Format>
  <TeaserFrontSplitHeadline.Editorial large>Es ist kalt</TeaserFrontSplitHeadline.Editorial>
  <TeaserFrontLead>
    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor.
  </TeaserFrontLead>
  <TeaserFrontCredit>
    An article by <TeaserFrontCreditLink href='#' color='#fba'>Christof Moser</TeaserFrontCreditLink>, 31 December 2017
  </TeaserFrontCredit>
</TeaserFrontSplit>
```

### Framed

```react
<TeaserFrontSplit
  frame
  image='/static/rothaus_portrait.jpg'
  byline='Foto: Laurent Burst'
  color='#fff' bgColor='#000'>
  <Editorial.Format>Neutrum</Editorial.Format>
  <TeaserFrontSplitHeadline.Editorial>Es ist kalt in Österreich</TeaserFrontSplitHeadline.Editorial>
  <TeaserFrontLead>
    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor.
  </TeaserFrontLead>
  <TeaserFrontCredit>
    An article by <TeaserFrontCreditLink href='#' color='#fba'>Christof Moser</TeaserFrontCreditLink>, 31 December 2017
  </TeaserFrontCredit>
</TeaserFrontSplit>
```

```react
<TeaserFrontSplit
  frame
  image='/static/rothaus_landscape.jpg'
  reverse
  byline='Foto: Laurent Burst'
  color='#fff' bgColor='#000'>
  <Editorial.Format>Neutrum</Editorial.Format>
  <TeaserFrontSplitHeadline.Editorial>Es ist kalt in Österreich</TeaserFrontSplitHeadline.Editorial>
  <TeaserFrontLead>
    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor.
  </TeaserFrontLead>
  <TeaserFrontCredit>
    An article by <TeaserFrontCreditLink href='#' color='#fba'>Christof Moser</TeaserFrontCreditLink>, 31 December 2017
  </TeaserFrontCredit>
</TeaserFrontSplit>
```
