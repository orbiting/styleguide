import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as glamor from 'glamor'
import * as styleguide from '../../lib.js'

import { requireFrom } from 'd3-require'
import Loader from '../Loader'

import SG from '../../theme/env'

const DEFAULT_WHITELIST = (SG.DYNAMIC_COMPONENT_BASE_URLS || '').split(',')

export const createRequire = (whitelist = DEFAULT_WHITELIST) => {
  const whitelisted = ['/', './'].concat(whitelist)
  return requireFrom(name => {
    if (whitelisted.some(base => name.startsWith(base))) {
      return name
    }
    return `./${name}`
  }).alias({
    react: React,
    'prop-types': PropTypes,
    glamor,
    '@project-r/styleguide': styleguide
  })
}

class DynamicComponent extends Component {
  constructor (...args) {
    super(...args)

    this.state = {}
  }
  componentDidMount () {
    this.props.require(this.props.src)
      .then(module => {
        this.setState({
          LoadedComponent: module.hasOwnProperty('default')
            ? module['default']
            : module
        })
      })
      .catch(error => {
        this.setState({error})
      })
  }
  render () {
    const { LoadedComponent } = this.state

    const error = this.state.error || (
      !this.props.src && new Error('Missing src')
    )
    if (error) {
      throw error
    }

    if (LoadedComponent) {
      return <LoadedComponent
        require={this.props.require}
        {...this.props.props} />
    }

    const { html, loader } = this.props
    if (html) {
      return <div
        dangerouslySetInnerHTML={{
          __html: html
        }}
      />
    }
    return <Loader
      {...loader}
      loading />
  }
}

DynamicComponent.propTypes = {
  src: PropTypes.string.isRequired,
  html: PropTypes.string,
  props: PropTypes.object,
  loader: PropTypes.object,
  require: PropTypes.func.isRequired
}

DynamicComponent.defaultProps = {
  require: createRequire()
}

export default DynamicComponent
