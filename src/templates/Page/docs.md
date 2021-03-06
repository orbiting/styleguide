A preconfigured article template using interaction typography to create pages.

```code|lang-jsx
import createPageSchema from '@project-r/styleguide/lib/templates/Page'

const schema = createPageSchema()
```

`createPageSchema` is configured with the following `documentEditorOptions`:

- `skipCredits`: true
- `titleCenter`: true (initial default - can always be changed)

And offers the following custom meta configuration options:
- `disableActionBar`: default false
- `discussion`: (optional) discussion repo (if set, will show up in action bar) 

Defaults:
- `repoPrefix`, `page-`
- `getPath`, `/:slug`
- `series`, false
- `darkMode`, false

# Example

```react|noSource
<Markdown schema={schema}>{`

<section><h6>TITLE</h6>

# Die Welt von Gregor Samsa

Jemand musste Josef K. verleumdet haben, denn ohne dass er etwas Böses getan hätte, wurde er eines Morgens verhaftet. «Wie ein Hund!» sagte er, es war, als sollte die Scham ihn überleben.

<hr /></section>

<section><h6>CENTER</h6>

Und es war ihnen wie eine Bestätigung ihrer neuen Träume und guten Absichten, als am Ziele ihrer Fahrt die Tochter als erste sich erhob und ihren jungen Körper dehnte. «Es ist ein eigentümlicher Apparat», sagte der Offizier zu dem Forschungsreisenden und überblickte mit einem gewissermaßen bewundernden Blick den ihm doch wohlbekannten Apparat. «Es ist ein eigentümlicher Apparat», sagte der Offizier zu dem Forschungsreisenden und überblickte mit einem gewissermaßen bewundernden Blick den ihm doch wohlbekannten Apparat.

## Wie ein Hund!

«Es ist ein eigentümlicher Apparat», sagte der Offizier zu dem Forschungsreisenden und überblickte mit einem gewissermaßen bewundernden Blick den ihm doch wohlbekannten Apparat.

<hr /></section>

`}</Markdown>
```
