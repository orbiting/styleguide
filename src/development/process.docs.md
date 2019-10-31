## Goals

- empower the developers to be fast
- document the available components
- keep styles and interaction behaviour consistent
  - even between different code bases
- enable division of labor
  - isolate the implementation and documentation of components
  - e.g. a new teaser can be implemented without knowing all the inner workings of the CMS

## General

1. All development should happen in branches and merged via a pull request.
2. Follow the [commit message format](/#commit-message-format) for proper versioning

## Adding a New Component

### Criteria for new components

- Generically useable
- Has been designed
- Has been used in more than one place
    + Same app, two places can count too

### General flow

1. Start a new branch
2. Develop the component
    - Document the public API with/in a catalog page
    - Export in `src/lib.js`
3. Create a pull request with screenshots
4. Review by another developer
5. Merge into master
    - Will be auto released
