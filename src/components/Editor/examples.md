## Basic Editor

```react
state: { value: 
[  
  {
    type: 'headline',
    children: [{ text: 'Title' }]
  }, {
    type: 'paragraph',
    children: [{ text: 'Paragraph' }]
  }
]
}
---
<Editor
  value={state.value}
  setValue={(newValue) => {
    setState({value: newValue})
  }}
/>
```