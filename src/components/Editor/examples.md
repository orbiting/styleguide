## Basic Editor

```react
state: { 
    value: [  
        {
           type: 'paragraph',
           children: [{ text: '111111' }]
        },
        {
            type: 'paragraph',
            children: [{ text: '222222' }]
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