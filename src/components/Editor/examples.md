## Basic Editor

```react
state: { 
    value: [  
        {
           type: 'headline',
           children: [{ text: '' }]
        },
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