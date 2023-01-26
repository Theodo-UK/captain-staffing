import React from 'react'

export default class ReloadButton extends React.Component {

  static propTypes = {
    reloadFunction: React.PropTypes.func.isRequired,
    syncStatus: React.PropTypes.bool,

  };
  constructor(props) {
    super(props)
  }

  render() {
    const { reloadFunction, syncStatus } = this.props

    if (!reloadFunction) {
      return null
    }

    const buttonText = syncStatus ? 'Updating...' : 'Reload'


    return (
      <button onClick={reloadFunction} className="btn" disabled={syncStatus}>
        {buttonText}
      </button>
    )
  }
}
