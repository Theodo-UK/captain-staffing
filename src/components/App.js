import React, { Component } from 'react'

import { toggleByPeopleRow } from '../helpers/edit'
import {
  clearLocaleStorage,
  loadLocalStorageItem,
  saveLocaleStorageItem,
} from '../helpers/localStorage'

import Alert from './Alert'
import StaffingTable from './StaffingTable'
import CaptainGoogle from './CaptainGoogle'

const reload = () => {
  clearLocaleStorage()
  location.reload()
}

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      googleAuthenticated: null,
      tabToggle: 'staffing',
      weeks: loadLocalStorageItem('weeks'),
      globalStaffing: loadLocalStorageItem('globalStaffing'),
    }
  }

  onGoogleSuccess() {
    this.setState({
      googleAuthenticated: true,
    })
  }

  onGoogleFailure() {
    this.setState({
      googleAuthenticated: false,
    })
  }

  onGoogleLoad(
    weeks,
    globalStaffing,
    error
    ) {
    if (
      globalStaffing 
    ) {
      this.setState({
        weeks,
        globalStaffing,
      })
      saveLocaleStorageItem('weeks', weeks)
      saveLocaleStorageItem('globalStaffing', globalStaffing)
    } else {
      this.setState({
        error,
      })
    }
  }

  onStaffingTableRowClick(peopleRow, type) {
      this.setState({
        globalStaffing: toggleByPeopleRow(
          peopleRow,
          this.state.globalStaffing
        ),
      })
  }

  render() {
    return (
      <div className="app">
        <h1 className="brand">Captain Staffing</h1>
        <div className="content">
          {this.renderGoogle()}
          {this.renderStaffing()}
        </div>
      </div>
    )
  }

  renderGoogle() {
    if (!this.state.googleAuthenticated) {
      return (
        <CaptainGoogle
          onSuccess={this.onGoogleSuccess.bind(this)}
          onFailure={this.onGoogleFailure.bind(this)}
          onLoad={this.onGoogleLoad.bind(this)}
        />
      )
    }

    return (<button
      onClick={reload}
      className="btn"
    >
      Reload
    </button>)
  }

  renderStaffing() {
    if (this.state.globalStaffing) {
      return (
        <div>
          <h1>Global Staffing</h1>
          <StaffingTable
            type="globalStaffing"
            peopleStaffing={this.state.globalStaffing}
            onRowClick={this.onStaffingTableRowClick.bind(this)}
            weeks={this.state.weeks}
          />
          <br />
        </div>
      )
    } else if (this.state.error) {
      return <Alert error={this.state.error} />
    } else if (this.state.googleAuthenticated) {
      return <div className="loader" />
    }
    return null
  }
}

export default App
