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

const commonFilterStyles = {
  padding: '12px',
  marginRight: '10px',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '4px',
  border: '3px solid #004262',
};

const selectedFilterStyle = {
  ...commonFilterStyles,
  backgroundColor: '#004262',
  color: 'white',
};

const unselectedFilterStyle = {
  ...commonFilterStyles,
  backgroundColor: 'white',
  color: '#004262',
  opacity: '0.8'
};

const customFilterStyle = {
  ...commonFilterStyles,
  backgroundColor: '#33A5FF',
  color: 'white',
};

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      googleAuthenticated: null,
      tabToggle: 'staffing',
      companies: loadLocalStorageItem('companies'),
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

  toggleFilter(targetCompany) {
    const newCompanies = {...this.state.companies, [targetCompany]: !this.state.companies[targetCompany]}
    this.setState({
      companies: newCompanies
    });
  }

  toggleAllActive(){
    const newCompanies = Object.keys(this.state.companies).reduce((acc, company) => { acc[company] = true; return acc; }, {});
    this.setState({
      companies: newCompanies
    });
  }

  toggleNoneActive(){
    const newCompanies = Object.keys(this.state.companies).reduce((acc, company) => { acc[company] = false; return acc; }, {});
    this.setState({
      companies: newCompanies
    });
  }

  onGoogleLoad(
    weeks,
    globalStaffing,
    companies,
    error
    ) {
    if (
      globalStaffing 
    ) {
      const companiesSelection = companies.reduce((acc, company) => { acc[company] = true; return acc; }, {});
      this.setState({
        weeks,
        companies: companiesSelection,
        globalStaffing,
      })
      saveLocaleStorageItem('weeks', weeks)
      saveLocaleStorageItem('globalStaffing', globalStaffing)
      saveLocaleStorageItem('companies', companiesSelection)
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
          <div className="header__main">
            <h1>Global Staffing</h1>
            {this.renderGoogle()}
          </div>
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
            {Object.entries(this.state.companies).map(([companyName, isSelected]) => {
              return (
                <div key={companyName} style={isSelected ? selectedFilterStyle : unselectedFilterStyle} onClick={()=>{ this.toggleFilter(companyName);}}>
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
            peopleStaffing={this.state.globalStaffing.filter(staffing => this.state.companies[staffing.company])}
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
