import React from 'react'

import { checkAuth, load } from '../helpers/spreadsheet'

export default class CaptainGoogle extends React.Component {
  static propTypes = {
    onSuccess: React.PropTypes.func.isRequired,
    onFailure: React.PropTypes.func.isRequired,
    onLoad: React.PropTypes.func.isRequired,
  }

  componentDidMount() {
    window.gapi.load('client', () => {
      checkAuth(true, this.handleAuth.bind(this))
    })
  }

  handleAuth(authResult) {
    if (authResult && !authResult.error) {
      this.props.onSuccess()
      load(this.props.onLoad)
    } else {
      this.props.onFailure()
    }
  }

  onClick(e) {
    e.preventDefault()
    checkAuth(false, this.handleAuth.bind(this))
  }

  render() {
    return (
      <button
        onClick={this.onClick.bind(this)}
        className="btn"
      >
        Connect with Google
      </button>
    )
  }
}
