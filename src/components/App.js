import React, { Component } from 'react'

import { toggleByPeopleRow } from '../helpers/edit'
import { checkTrelloAuth } from '../helpers/trello'
import {
  loadLocalStorageItem,
  saveLocaleStorageItem,
} from '../helpers/localStorage'

import Alert from './Alert'
import StaffingTable from './StaffingTable'
import CaptainGoogle from './CaptainGoogle'
import CaptainTrello from './CaptainTrello'
import Projects from './Projects'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      googleAuthenticated: null,
      weeks: loadLocalStorageItem('weeks'),
      architectStaffing: loadLocalStorageItem('architectStaffing'),
      agileCoachStaffing: loadLocalStorageItem('agileCoachStaffing'),
      developerStaffing: loadLocalStorageItem('developerStaffing'),
      trelloAuthenticated: null,
    }
  }

  componentDidMount() {
    checkTrelloAuth((authenticated) => {
      this.setState({
        trelloAuthenticated: authenticated,
      })
    })
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

  onGoogleLoad(weeks, architectStaffing, agileCoachStaffing, developerStaffing, error) {
    if (architectStaffing && agileCoachStaffing && developerStaffing) {
      this.setState({
        weeks,
        architectStaffing,
        agileCoachStaffing,
        developerStaffing,
      })
      saveLocaleStorageItem('weeks', weeks)
      saveLocaleStorageItem('architectStaffing', architectStaffing)
      saveLocaleStorageItem('agileCoachStaffing', agileCoachStaffing)
      saveLocaleStorageItem('developerStaffing', developerStaffing)
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
    }
  }

  onTrelloSuccess() {
    this.setState({
      trelloAuthenticated: true,
    })
  }

  onTrelloFailure() {
    this.setState({
      trelloAuthenticated: false,
    })
  }

  render() {
    return (
      <div className="app">
        <h1 className="brand">Captain Staffing</h1>
        <div className="content">
          {this.renderStaffing()}
          {this.renderGoogle()}
          {this.renderTrello()}
          {this.renderProjects()}
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
    return null
  }

  renderStaffing() {
    if (this.state.architectStaffing) {
      return (
        <div>
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
          <h1>Developers</h1>
          <StaffingTable
            type="developer"
            peopleStaffing={this.state.developerStaffing}
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

  renderTrello() {
    if (!this.state.trelloAuthenticated) {
      return (
        <CaptainTrello
          onSuccess={this.onTrelloSuccess.bind(this)}
          onFailure={this.onTrelloFailure.bind(this)}
        />
      )
    }
    return null
  }

  renderProjects() {
    if (this.state.trelloAuthenticated) {
      return <Projects />
    }
    return null
  }
}

export default App
