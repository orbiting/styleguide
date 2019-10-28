```react|span-3
<Field label='Label' />
```

```react|span-3
<Field label='Label' simulate='focus' />
```

```react|span-3
<Field label='Label' value='string' />
```

```react|span-3
<Field label='Label' value={0} />
```

```react|span-3
<Field
  label='E-Mail-Adresse'
  error='Geben sie eine gültige E-Mail-Adresse an' />
```

```react|span-3
<Field
  label='Label'
  icon={<SearchIcon size={30} />} />
```

```react|span-3
<Field
  disabled
  label='Label' />
```

```react|span-3
<Field
  disabled
  label='Label' value='Some Text' />
```

Normally `value` should be a string. Even if you pass in numbers, you'll receive strings on change by default.

Disabled fields should usually be rendered in a faded container.

Please note: `simulate` is for testing and documentation purposes only. It will not work in production environments.

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

```react
<Checkbox black checked onChange={() => {}}>
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
