## Fields

```react|span-3
<Field label='Label' />
```


```react|span-3
<Field
    label='E-Mail-Adresse'
    error='Geben sie eine gültige E-Mail-Adresse an' />
```

Override the inner focus state by explicitly passing `isFocused`.

Pass css pseudo states as `simulate` property to test or display behavior. Please note that the pseudo state simulator is a developer documentation helper and not meant to be used in production.

```react|span-3
<Field label='Label' isFocused={true} />
```

```react|span-3
<Field label='Label' simulate='focus' />
```

```react|span-3
<Field
  label='Label'
  icon={
    <SearchIcon
      size={30}
      onClick={() => {
        console.log('search')
      }}
    />
  } />
```

### Increase and Decrease

```react
state: {
  value: 240
}
---
<Field
  label='Betrag'
  value={state.value}
  onChange={(_, value) => setState({value})}
  onInc={() => setState({value: state.value + 10})}
  onDec={() => setState({value: state.value - 10})} />
```

### Black and White

```react|span-3
<Field black label='Label' />
```

```react|span-3,dark
<Field white label='Label' />
```

### Change and Validation

`onChange` gets called with the following arguments:

- `event: SyntheticEvent`
- `value: String`
- `shouldValidate: Boolean`

`shouldValidate` is a hint to run any necessary validations, if they fail an `error` should be set on the field.

`shouldValidate` becomes `true` after on the first blur if the field has been changed. An additional `onChange` is triggered when is happens.

```react
state: {
  value: ''
}
---
<Field
    label='Name'
    value={state.value}
    error={state.error}
    onChange={(event, value, shouldValidate) => {
      setState({
        error: (
          shouldValidate &&
          !value.trim().length &&
          'Geben sie Ihren Namen an'
        ),
        value: value
      })
    }} />
```

### Integration with Third-Party

Integration is possible with any input component which support `value`, `onChange`, `onFocus`, `onBlur` and `className`. To do so use a custom `renderInput`, see example below.

#### Example with `react-maskedinput`

```react
state: {
  value: '4242424242424242'
}
---
<Field
    value={state.value}
    onChange={(_, value) => setState({value})}
    label='Kreditkarten-Nummer'
    renderInput={props => <MaskedInput {...props} placeholderChar=" " mask="1111 1111 1111 1111" />} />
```

`npm i react-maskedinput --save`
`import MaskedInput from 'react-maskedinput'`

## Checkbox

```react
state: {checked: false}
---
<Checkbox
  checked={state.checked}
  onChange={(_, checked) => setState({checked})}>
  Ich akzeptiere die
  {' '}
  <A target='_blank' href='https://www.republik.ch/legal/agb'>
    Allgemeine Geschäftsbedingungen
  </A>
</Checkbox>
```

```react
<Checkbox checked onChange={() => {}}>
  Ich akzeptiere
</Checkbox>
```

```react
<Checkbox checked onChange={() => {}}>
  Eine wunderbare Heiterkeit hat meine ganze Seele eingenommen, gleich den süßen Frühlingsmorgen, die ich mit ganzem Herzen genieße.
</Checkbox>
```

```react
<Checkbox disabled onChange={() => {}}>
  Ich akzeptiere
</Checkbox>
```

```react
<Checkbox checked disabled onChange={() => {}}>
  Ich akzeptiere
</Checkbox>
```

## Radio

```react
state: {value: 'yes'}
---
<P>
  <Radio
    value='yes'
    checked={state.value === 'yes'}
    onChange={(event) => setState({value: event.target.value})}>
    Ja
  </Radio>
  <br />
  <Radio
    value='no'
    checked={state.value === 'no'}
    onChange={(event) => setState({value: event.target.value})}>
    Nein
  </Radio>
  <br />
  <Radio
    value='maybe'
    disabled={true}
    onChange={(event) => setState({value: event.target.value})}>
    Vielleicht
  </Radio>
  <br />
  <Radio
    value='never'
    checked={true}
    disabled={true}
    onChange={(event) => setState({value: event.target.value})}>
    Niemals
  </Radio>
</P>
```

## Composition

```react|noSource
<form>
  <Interaction.H2>Deine Unterstützung</Interaction.H2>
  <p>
    ...
  </p>

  <Interaction.H2>Deine Kontaktinformationen</Interaction.H2>
  <p style={{marginTop: 0}}>
    <Field label='Dein Name' />
    <Field label='Deine E-Mail' />
  </p>

  <p>
    <Checkbox>
      Ich akzeptiere
    </Checkbox>
  </p>

  <Button>Weiter</Button>
</form>
```

## Field Sets

A component for fast form building and state handling.

```react
state: {values: {}, errors: {}, dirty: {}}
---
<FieldSet
  values={state.values}
  errors={state.errors}
  dirty={state.dirty}
  onChange={fields => {
    setState(FieldSet.utils.mergeFields(fields))
  }}
  fields={[
    {
      label: 'Vorname',
      name: 'firstName',
      validator: (value) => (
        value.trim().length <= 0 && 'Vorname fehlt'
      )
    },
    {
      label: 'Nachname',
      name: 'lastName',
      validator: (value) => (
        value.trim().length <= 0 && 'Nachname fehlt'
      )
    },
    {
      label: 'Telefonnummer',
      name: 'phoneNumber',
      explanation: <Label>Mit Ländervorwahl</Label>
    }
  ]} />
```

You may add a `React.node` as `explanation` to be rendered after the field, and explain what should be entered.

### Custom Fields

It can easily be extended, e.g. to support custom inputs like masks and autosizing:

```react
state: {values: {}, errors: {}, dirty: {}}
---
<FieldSet
  additionalFieldProps={field => {
    const fieldProps = {}
    if (field.autoSize) {
      fieldProps.renderInput = (props) => (
        <AutosizeInput
          {...props}
          {...css({
            minHeight: 40,
            paddingTop: '7px !important',
            paddingBottom: '6px !important'
          })} />
      )
    }
    if (field.mask) {
      fieldProps.renderInput = (props) => (
        <MaskedInput
          {...props}
          {...css({
            '::placeholder': {
              color: 'transparent'
            },
            ':focus': {
              '::placeholder': {
                color: '#ccc'
              }
            }
          })}
          placeholderChar={field.maskChar || ' '}
          mask={field.mask} />
      )
    }
    return fieldProps
  }}
  fields={[
    {
      label: 'Geburtsdatum',
      name: 'birthday',
      mask: '11.11.1111',
      maskChar: '_',
      validator: value => value.trim().length <= 0 && 'Geburtsdatum fehlt'
    },
    {
      label: 'Gruss',
      name: 'greetings',
      autoSize: true
    }
  ]}
  values={state.values}
  errors={state.errors}
  dirty={state.dirty}
  onChange={fields => {
    setState(FieldSet.utils.mergeFields(fields))
  }} />
```

## Dropdown

There are two versions of the dropdown component: a native dropdown which uses `<select/>` and `<option/>`, and a virtual dropdown which uses the `downshift` library to manage its behavior and renders the UI using custom components. Both components are API-compatible. But you probably want to use a the third dropdown component, which decides automatically whether to use the virtual or native version. It makes this decision based on the user-agent string, not on the viewport size.

The options are given as a list of objects, each option must have the following keys:

 - **value**: an ID (string) unique across all options.
 - **text**: what is shown in the UI.

Here is the high-level `<Dropdown />` component:

```react
state: { value: '2' }
---
<Dropdown
  label='Bezeichnung'
  items={dropdownItems}
  value={state.value}
  onChange={(item) => {
    setState({value: item.value})
    console.log(`Selected '${item.text}'`)
  }}
/>
```

To explicitly use one or the other, use `<Dropdown.Virtual />` or `<Dropdown.Native />`. Below are the two versions, left the virtual and right the native.

```react
noSource: true
span: 3
state: { value: '2' }
---
<VirtualDropdown
  label='Bezeichnung'
  items={dropdownItems}
  value={state.value}
  onChange={(item) => {
    setState({value: item.value})
    console.log(`Selected '${item.text}'`)
  }}
/>
```
```react
noSource: true
span: 3
state: { value: '2' }
---
<NativeDropdown
  label='Bezeichnung'
  items={dropdownItems}
  value={state.value}
  onChange={(item) => {
    setState({value: item.value})
    console.log(`Selected '${item.text}'`)
  }}
/>
```

```hint
The virtual dropdown element uses negative margin left/right. This is needed so that the left edge of the text aligns with the other form elements. The example below shows an input field, a virtual dropdown and a native dropdown next to each other.
```

```react|noSource
<div>
  <Field label='Label' />
  <VirtualDropdown
    label='Bezeichnung'
    items={dropdownItems}
  />
  <NativeDropdown
    label='Bezeichnung'
    items={dropdownItems}
  />
</div>
```

### Black and White

```react|span-3
<Dropdown black
  label='Bezeichnung'
  items={dropdownItems} />
```

```react|span-3,dark
<Dropdown white
  label='Bezeichnung'
  items={dropdownItems} />
```

### VirtualDropdown Internal Components

#### `<Items />`

Renders a list of items, where one may be selected and one may be highlighted. This component is pure, controlled entirely from the outside. The selected / highlighted item is tracked by the `Downshift` component.

```react|span-2,plain,noSource
<VirtualDropdownInternal.Items
  items={dropdownItems}
  selectedItem={null}
  highlightedIndex={null}
  getItemProps={() => ({})}
/>
```
```react|span-2,plain,noSource
<VirtualDropdownInternal.Items
  items={dropdownItems}
  selectedItem={dropdownItems[0]}
  highlightedIndex={null}
  getItemProps={() => ({})}
/>
```
```react|span-2,plain,noSource
<VirtualDropdownInternal.Items
  items={dropdownItems}
  selectedItem={dropdownItems[0]}
  highlightedIndex={2}
  getItemProps={() => ({})}
/>
```

#### `<ItemsContainer />`

Wrapper around `<Items />` which implements the expand/collapse animation. The state is controlled by the `isOpen` prop. Note: this element uses negative margin left/right.

```react
span: 2
plain: true
noSource: true
state: {isOpen: false}
---
<div>
  <Button primary block onClick={() => {setState({isOpen: !state.isOpen})} }>
    toggle
  </Button>
  <div style={{minHeight: dropdownItems.length * 60 + 24, padding: 12}}>
    <VirtualDropdownInternal.ItemsContainer isOpen={state.isOpen}>
      <VirtualDropdownInternal.Items
        items={dropdownItems}
        selectedItem={dropdownItems[0]}
        highlightedIndex={1}
        getItemProps={() => ({})}
      />
    </VirtualDropdownInternal.ItemsContainer>
  </div>
</div>
```

#### `<Inner />`

Wrapper around the whole dropdown which add a drop shadow when the dropdown is open. It is `position:absolute` so that the items won't affect the layout of the page around the dropdown. So make sure to place this inside an element with relative position and fixed height.

On the left is an example with a static element inside it. On the right one which uses `<ItemsContainer />`.

```react
span: 3
plain: true
noSource: true
state: {isOpen: false}
---
<div style={{height: 276, padding: '60px 72px'}}>
  <div style={{position: 'relative'}}>
    <VirtualDropdownInternal.Inner isOpen={state.isOpen}>
      <div style={{padding: '48px 60px'}}>
        <Button primary block onClick={() => {setState({isOpen: !state.isOpen})} }>
          toggle
        </Button>
      </div>
    </VirtualDropdownInternal.Inner>
  </div>
</div>
```

```react
span: 3
plain: true
noSource: true
state: {isOpen: false}
---
<div style={{height: 276, padding: '60px 48px'}}>
  <div style={{position: 'relative'}}>
    <VirtualDropdownInternal.Inner isOpen={state.isOpen}>
      <div style={{padding: '48px 60px'}}>
        <Button primary block onClick={() => {setState({isOpen: !state.isOpen})} }>
          toggle
        </Button>

        <VirtualDropdownInternal.ItemsContainer isOpen={state.isOpen}>
          <VirtualDropdownInternal.Items
            items={dropdownItems}
            selectedItem={dropdownItems[0]}
            highlightedIndex={1}
            getItemProps={() => ({})}
          />
        </VirtualDropdownInternal.ItemsContainer>
      </div>
    </VirtualDropdownInternal.Inner>
  </div>
</div>
```

### Autocomplete

Provide a list of items and filter its contents with a text input. Uses [VirtualDropdown Internal Components](#virtualdropdown-internal-components) and therefore [`downshift`](https://github.com/paypal/downshift).

Properties:
  * **`items`** - Array of objects of shape `{ value: '1', text: 'Eins'}`
  * **`value`** - Object of shape `{ value: '1', text: 'Eins'}` or `null`. Not necessarily part of `items`.
  * **`filter`** - String that will be shown in the filter text input, or `null`.
  * **`onChange`** - Function with signature `nextValue => Void`.
  * **`onFilterChange`** - Function with signature `nextFilter => Void`.
  * **`icon`** - An icon to display on the right side of the input field, or `undefined`.
  * **`autoComplete`** - The `autocomplete` HTML5 attribute of the input field, defaults to `off` for suppressing the browser autocomplete dropdown.

`<Autocomplete />` does not incorporate any filter logic itself. Also, it can't be used as uncontrolled component. Both the `value` and the `filter` prop have to be passed in order for the component to behave correctly.

```react
state: {
  value: null,
  filter: '',
  items: [
    {text: 'Januar', value: '01'},
    {text: 'Februar', value: '02'},
    {text: 'März', value: '03'},
    {text: 'April', value: '04'},
    {text: 'Mai', value: '05'},
    {text: 'Juni', value: '06'},
    {text: 'Juli', value: '07'},
    {text: 'August', value: '08'},
    {text: 'September', value: '09'},
    {text: 'Oktober', value: '10'},
    {text: 'November', value: '10'},
    {text: 'Dezember', value: '10'}
  ]
}
---
<Autocomplete
    label='Monat'
    value={state.value}
    filter={state.filter}
    items={
      state.items.filter(
        ({text}) =>
          !state.filter || text.toLowerCase().includes(state.filter.toLowerCase())
      )
    }
    onChange={
      value => {
        setState({...state, value})
      }
    }
    onFilterChange={
      filter => setState({...state, filter})
    }
/>
```

```react
state: {
  value: null,
  filter: '',
  items: [
    {text: 'Januar', value: '01'},
    {text: 'Februar', value: '02'},
    {text: 'März', value: '03'},
    {text: 'April', value: '04'},
    {text: 'Mai', value: '05'},
    {text: 'Juni', value: '06'},
    {text: 'Juli', value: '07'},
    {text: 'August', value: '08'},
    {text: 'September', value: '09'},
    {text: 'Oktober', value: '10'},
    {text: 'November', value: '10'},
    {text: 'Dezember', value: '10'}
  ]
}
---
<Autocomplete
    label='Monat'
    value={state.value}
    filter={state.filter}
    items={
      state.items.filter(
        ({text}) =>
          !state.filter || text.toLowerCase().includes(state.filter.toLowerCase())
      )
    }
    onChange={
      value => {
        setState({...state, value})
      }
    }
    onFilterChange={
      filter => setState({...state, filter})
    }
    icon={
      <SearchIcon
        size={30}
        onClick={() => {
          console.log('search')
        }}
      />
    }
    autoComplete='on'
/>
```
