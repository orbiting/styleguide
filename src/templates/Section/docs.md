A preconfigured article template for section pages.

```code|lang-jsx
import createSectionSchema from '@project-r/styleguide/lib/templates/Section'

const schema = createSectionSchema()
```

`createSectionSchema` take the same keys as the article template.

Defaults:
- `repoPrefix`, `section-`
- `getPath`, `/:slug`
- `customMetaFields`, always adds repo refs for `discussion`, `dossier` and `format` settings with a `kind` (font) and `color` field.
- `series`, false
- `darkMode`, false

# Example

```react|noSource
<Markdown schema={schema}>{`

<section><h6>TITLE</h6>

# Dada

<hr /></section>

<section><h6>CENTER</h6>

Er hörte leise Schritte hinter sich. Das bedeutete nichts Gutes. Wer würde ihm schon folgen, spät in der Nacht und dazu noch in dieser engen Gasse mitten im übel beleumundeten Hafenviertel?

Gerade jetzt, wo er das Ding seines Lebens gedreht hatte und mit der Beute verschwinden wollte! Hatte einer seiner zahllosen Kollegen dieselbe Idee gehabt, ihn beobachtet und abgewartet, um ihn nun um die Früchte seiner Arbeit zu erleichtern?

<hr /></section>

`}</Markdown>
```
