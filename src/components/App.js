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
      weeks: loadLocalStorageItem('weeks'),
      architectStaffing: loadLocalStorageItem('architectStaffing'),
      agileCoachStaffing: loadLocalStorageItem('agileCoachStaffing'),
      developerStaffing: loadLocalStorageItem('developerStaffing'),
      serverlessStaffing: loadLocalStorageItem('serverlessStaffing'),
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
    architectStaffing,
    agileCoachStaffing,
    developerStaffing,
    serverlessStaffing,
    error
    ) {
    if (architectStaffing && agileCoachStaffing && developerStaffing && serverlessStaffing) {
      this.setState({
        weeks,
        architectStaffing,
        agileCoachStaffing,
        developerStaffing,
        serverlessStaffing,
      })
      saveLocaleStorageItem('weeks', weeks)
      saveLocaleStorageItem('architectStaffing', architectStaffing)
      saveLocaleStorageItem('agileCoachStaffing', agileCoachStaffing)
      saveLocaleStorageItem('developerStaffing', developerStaffing)
      saveLocaleStorageItem('serverlessStaffing', serverlessStaffing)
    } else {
      this.setState({
        error,
      })
    }
  }

  onStaffingTableRowClick(peopleRow, type) {
    if (type === 'architect') {
      this.setState({
        architectStaffing: toggleByPeopleRow(
          peopleRow,
          this.state.architectStaffing
        ),
      })
    } else if (type === 'agileCoach') {
      this.setState({
        agileCoachStaffing: toggleByPeopleRow(
          peopleRow,
          this.state.agileCoachStaffing
        ),
      })
    } else if (type === 'developer') {
      this.setState({
        developerStaffing: toggleByPeopleRow(
          peopleRow,
          this.state.developerStaffing
        ),
      })
    } else if (type === 'serverless') {
      this.setState({
        developerStaffing: toggleByPeopleRow(
          peopleRow,
          this.state.serverlessStaffing
        ),
      })
    }
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
    if (this.state.architectStaffing) {
      return (
        <div>
          <h1>Developers</h1>
          <StaffingTable
            type="developer"
            peopleStaffing={this.state.developerStaffing}
            onRowClick={this.onStaffingTableRowClick.bind(this)}
            weeks={this.state.weeks}
          />
          <br />
          <h1>Architects</h1>
          <StaffingTable
            type="architect"
            peopleStaffing={this.state.architectStaffing}
            onRowClick={this.onStaffingTableRowClick.bind(this)}
            weeks={this.state.weeks}
          />
          <br />
          <h1>Agile Coaches</h1>
          <StaffingTable
            type="agileCoach"
            peopleStaffing={this.state.agileCoachStaffing}
            onRowClick={this.onStaffingTableRowClick.bind(this)}
            weeks={this.state.weeks}
          />
          <br />
          <h1>🚀 Serverless</h1>
          <StaffingTable
            type="serverless"
            peopleStaffing={this.state.serverlessStaffing}
            onRowClick={this.onStaffingTableRowClick.bind(this)}
            weeks={this.state.weeks}
          />
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
