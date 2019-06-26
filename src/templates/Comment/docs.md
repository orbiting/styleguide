## Web schema

```code|lang-jsx
import createCommentSchema from '@project-r/styleguide/lib/templates/Comment/web'

const webSchema = createCommentSchema()
```


```react|noSource
<Markdown schema={webSchema}>{`

A comment with [a link](https://example.com/ "Mit Titel"), an autolinked URL https://www.republik.ch, a long autolinked URL https://www.republik.ch/01234567890123456789012345678901234567890123456789.png, ![an image](/static/landscape.jpg?size=2000x1411 "Mit Bildtitel") and [...] an ellipsis.

Cursive (italic) with *asterisks* or _underscores_.

Strong (bold) with **asterisks** or __underscores__.

Combined _**cursive bold**_.

Strikethrough uses two tildes. ~~Scratch this.~~

1. First **ordered list** item
2. Another item
1. Actual numbers don't matter, just that it's a number
4. And another item.

* First **unordered list** item
* Another item
* And another item

***

A thematic break above.

All headings are mapped to bold:

# Heading 1

## Heading 2

### Heading 3

A small blockquote:

> **Blockquote** paragraph one
> on *two lines*
>
> Paragraph two on another line

A large blockquote:

> ## Blockquote level 0
> 
> **Blockquote** paragraph one
> on *two lines*
>
> Paragraph two on another line
>
> ***
>
> 1. First **ordered list** item
> 2. Another item
> 1. Actual numbers don't matter, just that it's a number
> 4. And another item.
>
> * First **unordered list** item
> * Another item
> * And another item
>
>> Nested Blockquote level 1
>>> Nested Blockquote level 2
>>>> Nested Blockquote level 3
>>>>> Nested Blockquote level 4
>
>
> Inline \`code\` uses \`back-ticks\`.
>
> \`\`\`
> A code block nested inside a blockquote
> second line
>
> third line
> \`\`\`

Inline \`code\` uses \`back-ticks\`.

\`\`\`
A code block
second line

third line
\`\`\`

<h1>Block-level HTML tags aren't supported.</h1>

Inline HTML tags like <sub>subscript</sub> and <sup>superscript</sup> are not supported.

[Some link reference][1]
[Some labelled reference][label]
![Some image reference alt text][imageIdentifier]

[1]: https://republik.ch
[label]: https://project-r.construction
[imageIdentifier]: /static/landscape.jpg

`}</Markdown>
```


## Email schema

```code|lang-jsx
import createCommentSchema from '@project-r/styleguide/lib/templates/Comment/email'

const emailSchema = createCommentSchema()
```


```react|noSource
<Markdown schema={emailSchema}>{`


A comment with [a link](https://example.com/ "Mit Titel"), an autolinked URL https://www.republik.ch, a long autolinked URL https://www.republik.ch/01234567890123456789012345678901234567890123456789.png, ![an image](/static/landscape.jpg?size=2000x1411 "Mit Bildtitel") and [...] an ellipsis.

Cursive (italic) with *asterisks* or _underscores_.

Strong (bold) with **asterisks** or __underscores__.

Combined _**cursive bold**_.

Strikethrough uses two tildes. ~~Scratch this.~~

1. First **ordered list** item
2. Another item
1. Actual numbers don't matter, just that it's a number
4. And another item.

* First **unordered list** item
* Another item
* And another item

***

A thematic break above.

All headings are mapped to bold:

# Heading 1

## Heading 2

### Heading 3

A small blockquote:

> **Blockquote** paragraph one
> on *two lines*
>
> Paragraph two on another line

A large blockquote:

> ## Blockquote level 0
> 
> **Blockquote** paragraph one
> on *two lines*
>
> Paragraph two on another line
>
> ***
>
> 1. First **ordered list** item
> 2. Another item
> 1. Actual numbers don't matter, just that it's a number
> 4. And another item.
>
> * First **unordered list** item
> * Another item
> * And another item
>
>> Nested Blockquote level 1
>>> Nested Blockquote level 2
>>>> Nested Blockquote level 3
>>>>> Nested Blockquote level 4
>
>
> Inline \`code\` uses \`back-ticks\`.
>
> \`\`\`
> A code block nested inside a blockquote
> second line
>
> third line
> \`\`\`

Inline \`code\` uses \`back-ticks\`.

\`\`\`
A code block
second line

third line
\`\`\`

<h1>Block-level HTML tags aren't supported.</h1>

Inline HTML tags like <sub>subscript</sub> and <sup>superscript</sup> are not supported.

[Some link reference][1]
[Some labelled reference][label]
![Some image reference alt text][imageIdentifier]

[1]: https://republik.ch
[label]: https://project-r.construction
[imageIdentifier]: /static/landscape.jpg

`}</Markdown>
```
