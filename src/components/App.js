import React, { Component } from 'react'

import { toggleByPeopleRow } from '../helpers/edit'
import {
  clearLocaleStorage,
  saveLocaleStorageItem,
} from '../helpers/localStorage'

import Alert from './Alert'
import StaffingTable from './StaffingTable'
import CaptainGoogle from './CaptainGoogle'

import {
  companySelectedFilterStyle,
  companyUnselectedFilterStyle,
  positionSelectedFilterStyle,
  positionUnselectedFilterStyle,
  customFilterStyle,
} from './App.styles';

const reload = () => {
  clearLocaleStorage()
  window.location.reload()
}
class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      googleAuthenticated: null,
      tabToggle: 'staffing',
      companies: undefined,
      positions: undefined,
      weeks: undefined,
      globalStaffing: undefined,
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

  toggleCompanyFilter(targetCompany) {
    const newCompanies = {...this.state.companies, [targetCompany]: !this.state.companies[targetCompany]}
    this.setState({
      companies: newCompanies
    });
  }

  togglePositionFilter(targetPosition) {
    const newPositions = {...this.state.positions, [targetPosition]: !this.state.positions[targetPosition]}
    this.setState({
      positions: newPositions
    });
  }

  toggleAllActive(){
    const newCompanies = Object.keys(this.state.companies).reduce((acc, company) => { acc[company] = true; return acc; }, {});
    const newPositions = Object.keys(this.state.positions).reduce((acc, position) => { acc[position] = true; return acc; }, {});

    this.setState({
      companies: newCompanies,
      positions: newPositions
    });
  }

  toggleNoneActive(){
    const newCompanies = Object.keys(this.state.companies).reduce((acc, company) => { acc[company] = false; return acc; }, {});
    const newPositions = Object.keys(this.state.positions).reduce((acc, position) => { acc[position] = false; return acc; }, {});
    this.setState({
      companies: newCompanies,
      positions: newPositions
    });
  }

  onGoogleLoad(
    weeks,
    globalStaffing,
    companies,
    positions,
    error
    ) {
    if (
      globalStaffing 
    ) {
      const companiesSelection = companies.reduce((acc, company) => { acc[company] = true; return acc; }, {});
      const positionSelection = positions.reduce((acc, position) => { acc[position] = true; return acc; }, {});
      console.log('LALA', positionSelection, positions)

      this.setState({
        weeks,
        companies: companiesSelection,
        positions: positionSelection,
        globalStaffing,

      })
      saveLocaleStorageItem('weeks', weeks)
      saveLocaleStorageItem('globalStaffing', globalStaffing)
      saveLocaleStorageItem('companies', companiesSelection)
      saveLocaleStorageItem('positions', positionSelection)

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
        <div className="app__bar">
          <h1 className="brand">Captain Staffing</h1>
          <div className="loader__container">
            {this.renderGoogle()}
          </div>
        </div>
        <div className="content">
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
          <div className="filter-container">
          {Object.entries(this.state.positions).map(([positionName, isSelected]) => {
              return (
                <div key={positionName} style={isSelected ? positionSelectedFilterStyle : positionUnselectedFilterStyle} onClick={()=>{ this.togglePositionFilter(positionName);}}>
                  {positionName}
                </ div>
              )
            })}
            {Object.entries(this.state.companies).map(([companyName, isSelected]) => {
              return (
                <div key={companyName} style={isSelected ? companySelectedFilterStyle : companyUnselectedFilterStyle} onClick={()=>{ this.toggleCompanyFilter(companyName);}}>
                  {companyName}
                </ div>
              )
            })}
            <div style={customFilterStyle} onClick={this.toggleAllActive.bind(this)}>
              Toggle All
            </div>
            <div style={customFilterStyle} onClick={this.toggleNoneActive.bind(this)}>
              Toggle None
            </div>
          </div>
          <StaffingTable
            type="globalStaffing"
            peopleStaffing={this.state.globalStaffing.filter(staffing => this.state.companies[staffing.company]).filter(staffing => this.state.positions[staffing.position])}
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
