The `Loader` displays a `Spinner` while the `loading` prop is true. Otherwise it renders the function passed to the `render` prop, or an error message if there is an `error`.

`Loader` also accepts `message`, `width` and `height` props. 

```react|span-3
<div style={{height: 140}}>
  <Loader
    loading={true}
    render={() => <P>Content loaded</P>}
  />
</div>
```
```react|span-3
<div style={{height: 140}}>
  <Loader
    loading={true}
    message={'Loading…'}
    render={() => <P>Content loaded</P>}
  />
</div>
```

```react|span-3
<div style={{height: 140}}>
  <Loader
    loading={false}
    render={() => <P>Content loaded</P>}
  />
</div>
```
```react|span-3
<div style={{height: 140}}>
  <Loader
    error={'An error has occured'}
    render={() => <P>Content loaded</P>}
  />
</div>
```
