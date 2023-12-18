import React from 'react'

import { checkAuth, load } from '../helpers/spreadsheet'

export default class CaptainGoogle extends React.Component {
  static propTypes = {
    onSuccess: React.PropTypes.func.isRequired,
    onFailure: React.PropTypes.func.isRequired,
    onLoad: React.PropTypes.func.isRequired,
  }

  // componentDidMount() {
  //   window.gapi.load('client', () => {
  //     checkAuth(true, this.handleAuth.bind(this))
  //   })
  // }

  handleAuth(authResult) {
    console.log(
      "🚀 ~ file: CaptainGoogle.js:19 ~ CaptainGoogle ~ handleAuth ~ authResult:",
      authResult
    )
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
      <div>
        <div 
          id="g_id_onload"
          data-client_id="1074312790731-krtvpaq8km1h94gspgpqt7o6v8u2ss4g.apps.googleusercontent.com"
          data-context="signin"
          data-ux_mode="popup"
          data-callback='onClick'
          data-auto_prompt="false"
        />

        <div 
        // TODO check class or className
          className="g_id_signin"
          data-type="standard"
          data-shape="pill"
          data-theme="outline"
          data-text="signin_with"
          data-size="large"
          data-logo_alignment="left"
        />
      </div>
    )
  }
}
