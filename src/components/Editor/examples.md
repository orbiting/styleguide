## Basic Editor

```react
state: { 
    value: [  
        {
            type: 'headline',
            children: [{ text: 'Title' }]
        }, {
            type: 'paragraph',
            children: [{ text: 'Paragraph' }]
        }
    ],
    structure: [
        {
            type: 'headline'
        },
        {
            type: 'paragraph',
            repeat: true
        },
        {
            type: 'figure'
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