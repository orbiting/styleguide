## Editor

Tab, tab, BOOM!

```react
state: { 
    value: [  
        {
           type: 'paragraph',
           children: [{ text: '' }]
        }
    ],
    structure: [
        {
            type: 'headline'
        },
        {
            type: 'paragraph'
        },
        {
            type: 'pullQuote'
        },
        {
            type: 'figure'
        },
        {
            type: 'paragraph',
            repeat: true
        }
    ]
}
---
<Editor
    value={state.value}
    setValue={(newValue) => {
        setState({value: newValue})
    }}
    structure={state.structure}
/>
```