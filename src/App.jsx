import React, { Component } from "react";
import _ from "lodash";
import moment from "moment";

import { toggleByPeopleRow, toggleByProjectRow } from "./helpers/edit";
import { mergeUnion } from "./helpers/utils";
import {
  deserializeTruthyFilters,
  serializeTruthyFilters,
} from "./helpers/urlSerialiser";

import { clearLocaleStorage } from "./helpers/localStorage";

import Alert from "./components/Alert";

import StaffingTable from "./components/staffing/StaffingTable";
import ProjectTable from "./components/project/ProjectTable";
import { columnTitles, getColumnFilter } from "./helpers/formatter";

import CaptainGoogle from "./components/CaptainGoogle";

import DropdownTreeSelect from "react-dropdown-tree-select";
import "react-dropdown-tree-select/dist/styles.css";

import LastUpdatedText from "./components/LastUpdatedText";
import { getSyncStatus, scheduleUpdate } from "./helpers/spreadsheet";
import ReloadButton from "./components/ReloadButton";
import { Toolbar } from "./components/Toolbar/Toolbar";
import { TABS } from "./constants";

const reload = () => {
  clearLocaleStorage();
  window.location.reload();
};

const LOCAL_FILTERS = {
  POSITIONS: "positionsFilterLocalStorage",
  COMPANIES: "companiesFilterLocalStorage",
};

const getImportanceLookup = (weeks) => {
  const baseImportanceValues = [
    70, 45, 40, 30, 25, 10, 6, 6, 6, 4, 4, 4, 4, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1,
    1, 1, 1,
  ];
  const importanceValuesWithDate = {};
  weeks.forEach(
    (week) => (importanceValuesWithDate[week] = baseImportanceValues.shift())
  );
  return importanceValuesWithDate;
};

const getProjectImportance = (staff, importanceLookup) => {
  let importance = 0;
  Object.entries(staff.staffing).forEach(([key, value]) => {
    importance +=
      !value._total || isNaN(value._total) || !importanceLookup[key]
        ? 0
        : importanceLookup[key];
  });
  return importance;
};

const getStaffingImportance = (staff, importanceLookup) => {
  let importance = 0;
  Object.entries(staff.staffing).forEach(([key, value]) => {
    importance +=
      !value._total || isNaN(value._total) || !importanceLookup[key]
        ? 0
        : (_.min([value._total, 5]) / 5) * importanceLookup[key];
  });
  return importance;
};

const uriQuery = {
  companies: "",
  positions: "",
};

const updateFilterStorage = (key, object) => {
  const newurl = `${window.location.origin}${window.location.pathname}`;

  // eslint-disable-next-line default-case
  switch (key) {
    case LOCAL_FILTERS.COMPANIES: {
      uriQuery.companies = serializeTruthyFilters(object);
      break;
    }

    case LOCAL_FILTERS.POSITIONS: {
      uriQuery.positions = serializeTruthyFilters(object);
      break;
    }
  }

  window.history.pushState(
    { path: newurl },
    "",
    `${newurl}?companies=${uriQuery.companies}&positions=${uriQuery.positions}`
  );
  window.localStorage.setItem(key, JSON.stringify(object));
};

const setupFilters = (filterList, urlQuery, localStorage) => {
  if (urlQuery) {
    return filterList.reduce((acc, option) => {
      acc[option] = Object.keys(urlQuery).includes(option);
      return acc;
    }, {});
  }

  return mergeUnion(
    filterList.reduce((acc, company) => {
      acc[company] = true;
      return acc;
    }, {}),
    localStorage
  );
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isGoogleAuthenticated: null,
      tabToggle: "staffing",
      companies: undefined,
      positions: undefined,
      weeks: undefined,
      globalStaffing: undefined,
      globalProjects: undefined,
      isSortedByImportance: false,
      activeTab: TABS.STAFFING,
      isSyncing: false,
      isRefreshRequired: false,
      columnOrder: Object.keys(columnTitles),
    };

    this.lastClicked = undefined;
  }

  onGoogleSuccess() {
    this.setState({
      isGoogleAuthenticated: true,
    });
    getSyncStatus(this.onSyncUpdate.bind(this));
  }

  onSyncUpdate(syncStatus, error) {
    if (error) {
      console.log("Error fetching sync status.");
      return;
    }
    if (this.state.isSyncing && !syncStatus) {
      this.setState({ isRefreshRequired: true });
    }
    this.setState({ isSyncing: syncStatus });
    console.log("Sync status:", this.state.isSyncing);
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      if (this.state.isGoogleAuthenticated) {
        getSyncStatus(this.onSyncUpdate.bind(this));
      }
    }, 50000);
  }

  onGoogleFailure() {
    this.setState({
      googleAuthenticated: false,
    });
  }

  toggleCompanyFilter(targetCompany) {
    const newCompanies = {
      ...this.state.companies,
      [targetCompany]: !this.state.companies[targetCompany],
    };

    updateFilterStorage(LOCAL_FILTERS.COMPANIES, newCompanies);

    this.setState({
      companies: newCompanies,
    });
  }

  toggleAllActive() {
    const newCompanies = Object.keys(this.state.companies).reduce(
      (acc, company) => {
        acc[company] = true;
        return acc;
      },
      {}
    );
    updateFilterStorage(LOCAL_FILTERS.COMPANIES, newCompanies);

    this.setState({ companies: newCompanies });
  }

  toggleNoneActive() {
    const newCompanies = Object.keys(this.state.companies).reduce(
      (acc, company) => {
        acc[company] = false;
        return acc;
      },
      {}
    );
    updateFilterStorage(LOCAL_FILTERS.COMPANIES, newCompanies);
    this.setState({
      companies: newCompanies,
    });
  }

  onGoogleLoad(
    weeks,
    globalStaffing,
    companies,
    positions,
    globalProjects,
    lastUpdated,
    error
  ) {
    if (globalStaffing && globalProjects) {
      const query = window.location.search.substring(1);

      let queryFilters = {};
      if (query) {
        const vars = query.split("&");
        queryFilters = vars.reduce((acc, company) => {
          const pair = company.split("=");
          acc[pair[0]] = deserializeTruthyFilters(pair[1].split(","));
          return acc;
        }, {});
      }

      const storagePositionsFilter = JSON.parse(
        window.localStorage.getItem(LOCAL_FILTERS.POSITIONS)
      );
      const storageCompaniesFilter = JSON.parse(
        window.localStorage.getItem(LOCAL_FILTERS.COMPANIES)
      );

      const companiesSelection = setupFilters(
        companies,
        queryFilters.companies,
        storageCompaniesFilter
      );

      const positionSelection = setupFilters(
        positions,
        queryFilters.positions,
        storagePositionsFilter
      );

      const formattedWeeks = weeks.map((week) =>
        moment(week, "DD/MM/YYYY").format("YYYY/MM/DD")
      );

      const globalStaffingWithImportance = globalStaffing.map((staff) => ({
        ...staff,
        importance: getStaffingImportance(
          staff,
          getImportanceLookup(formattedWeeks)
        ),
      }));
      const globalProjectsWithImportance = globalProjects.map((staff) => ({
        ...staff,
        importance: getProjectImportance(
          staff,
          getImportanceLookup(formattedWeeks)
        ),
      }));

      updateFilterStorage(LOCAL_FILTERS.COMPANIES, companiesSelection);
      updateFilterStorage(LOCAL_FILTERS.POSITIONS, positionSelection);

      this.setState({
        weeks: formattedWeeks,
        companies: companiesSelection,
        positions: positionSelection,
        globalStaffing: globalStaffingWithImportance,
        globalProjects: globalProjectsWithImportance,
        lastUpdatedTime: lastUpdated,
      });
    } else {
      this.setState({
        error,
      });
    }
  }

  onStaffingTableRowClick(peopleRow) {
    this.setState({
      globalStaffing: toggleByPeopleRow(peopleRow, this.state.globalStaffing),
    });
  }

  onProjectTableRowClick(projectRow) {
    this.setState({
      globalProjects: toggleByProjectRow(projectRow, this.state.globalProjects),
    });
  }

  render() {
    return (
      <div className="app">
        <div className="app__bar">
          <h1 className="brand">Captain Staffing</h1>
          <div className="loader__container">{this.renderGoogle()}</div>
        </div>
        <div className="content">{this.renderStaffing()}</div>
      </div>
    );
  }

  renderGoogle() {
    if (!this.state.isGoogleAuthenticated) {
      return (
        <CaptainGoogle
          onSuccess={this.onGoogleSuccess.bind(this)}
          onFailure={this.onGoogleFailure.bind(this)}
          onLoad={this.onGoogleLoad.bind(this)}
        />
      );
    }

    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <LastUpdatedText lastUpdatedString={this.state.lastUpdatedTime} />
        <ReloadButton
          reloadFunction={
            this.state.isRefreshRequired ? reload : scheduleUpdate
          }
          syncStatus={this.state.isSyncing}
          isRefreshRequired={this.state.isRefreshRequired}
        />
      </div>
    );
  }

  changeStaffingList() {
    this.setState({
      globalStaffing: this.state.isSortedByImportance
        ? _.orderBy(
            this.state.globalStaffing,
            ["company", "_name"],
            ["asc", "asc"]
          )
        : _.orderBy(this.state.globalStaffing, ["importance"], ["asc"]),
      globalProjects: this.state.isSortedByImportance
        ? _.orderBy(this.state.globalProjects, ["_name"], ["asc"])
        : _.orderBy(this.state.globalProjects, ["importance"], ["asc"]),
      isSortedByImportance: !this.state.isSortedByImportance,
    });
  }

  changeActiveTab() {
    this.setState((state) => ({
      activeTab:
        state.activeTab === TABS.STAFFING ? TABS.PROJECT : TABS.STAFFING,
    }));
  }

  positionsSelectorOnChange(currentNode, selectedNodes) {
    const newPositions = Object.keys(this.state.positions).reduce(
      (acc, position) => {
        acc[position] = selectedNodes.some((node) => node.label === "All");
        return acc;
      },
      {}
    );

    selectedNodes.forEach((node) => {
      if (node._children.length > 0) {
        node._children.forEach((child) => {
          newPositions[child] = true;
        });
      } else {
        newPositions[node.label] = true;
      }
    });

    updateFilterStorage(LOCAL_FILTERS.POSITIONS, newPositions);

    this.lastClicked = currentNode.label;

    this.setState({
      positions: newPositions,
    });
  }

  handleColumnHide(currentNode, selectedNodes) {
    const selected = selectedNodes.map((node) => node.label);
    this.setState({
      columnOrder: Object.values(selected),
    });
  }

  renderStaffing() {
    if (this.state.globalStaffing && this.state.globalProjects) {
      const staffingToDisplay = this.state.globalStaffing
        .filter((staffing) => this.state.companies[staffing.company])
        .filter((staffing) => this.state.positions[staffing.position]);
      const projectToDisplay = this.state.globalProjects.filter((project) =>
        project.companies.some((company) => this.state.companies[company])
      );

      const inStaffingCrisis = staffingToDisplay.filter(
        (staffing) => staffing.isInStaffingCrisis
      ).length;

      const inStaffingAlert =
        staffingToDisplay.filter((staffing) => staffing.isInStaffingAlert)
          .length - inStaffingCrisis;
      return (
        <div>
          <Toolbar
            positionsState={this.state.positions}
            positionLastClicked={this.lastClicked}
            positionsSelectorOnChange={this.positionsSelectorOnChange.bind(
              this
            )}
            companiesState={this.state.companies}
            toggleCompanyFilter={this.toggleCompanyFilter.bind(this)}
            toggleAllActive={this.toggleAllActive.bind(this)}
            toggleNoneActive={this.toggleNoneActive.bind(this)}
            changeStaffingList={this.changeStaffingList.bind(this)}
            isSortedByImportance={this.state.isSortedByImportance}
            changeActiveTab={this.changeActiveTab.bind(this)}
            activeTab={this.state.activeTab}
          />

          {this.state.activeTab === TABS.STAFFING && (
            <div>
              <div>
                <div className="stats-container">
                  <span className="stats-indicator">
                    Staffing alert count: <span>{inStaffingAlert}</span>
                  </span>
                  <span className="stats-indicator">
                    Staffing crisis count: <span>{inStaffingCrisis}</span>
                  </span>
                </div>
                <div style={{ float: "right" }}>
                  <DropdownTreeSelect
                    texts={{ placeholder: "Filter Columns" }}
                    className="positionDropdown"
                    data={getColumnFilter(this.state.columnOrder)}
                    onChange={this.handleColumnHide.bind(this)}
                  />
                </div>
              </div>

              <StaffingTable
                peopleStaffing={staffingToDisplay}
                onRowClick={this.onStaffingTableRowClick.bind(this)}
                weeks={this.state.weeks}
                columnOrder={this.state.columnOrder}
              />
            </div>
          )}
          {this.state.activeTab === TABS.PROJECT && (
            <div>
              <ProjectTable
                projectStaffing={projectToDisplay}
                onRowClick={this.onProjectTableRowClick.bind(this)}
                weeks={this.state.weeks}
              />
            </div>
          )}
          <br />
        </div>
      );
    } else if (this.state.error) {
      console.log(this.state.error);
      return <Alert error={this.state.error} />;
    } else if (this.state.isGoogleAuthenticated) {
      return <div className="loader" />;
    }
    return null;
  }
}

export default App;
