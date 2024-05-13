/* eslint-disable complexity */
/* eslint-disable max-lines */
import React, { Component } from "react";
import _ from "lodash";
import moment from "moment";

import { toggleByPeopleRow, toggleByProjectRow } from "./helpers/edit";
import {
  LOCAL_FILTERS,
  deserializeTruthyFilters,
  setupFilters,
  updateFilterStorage,
} from "./helpers/urlSerialiser";

import { clearLocaleStorage } from "./helpers/localStorage";

import Alert from "./components/Alert";

import StaffingTable from "./components/staffing/StaffingTable";
import ProjectTable from "./components/project/ProjectTable";

import CaptainGoogle from "./components/CaptainGoogle";

import LastUpdatedText from "./components/LastUpdatedText";
import { getSyncStatus, scheduleUpdate } from "./helpers/spreadsheet";
import ReloadButton from "./components/ReloadButton";
import { Toolbar } from "./components/Toolbar/Toolbar";
import { INITIAL_COLUMN_STATE } from "./components/Toolbar/FilterColumns/FilterColumns.utils";
import { TABS } from "./constants";

const IS_SORTED_BY_IMPORTANCE_DEFAULT = true;

const sortByImportance = (inputArray) =>
  _.orderBy(inputArray, ["importance"], ["asc"]);

const reload = () => {
  clearLocaleStorage();
  window.location.reload();
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
      isSortedByImportance: IS_SORTED_BY_IMPORTANCE_DEFAULT,
      activeTab: TABS.STAFFING,
      isSyncing: false,
      isRefreshRequired: false,
      tableColumns: INITIAL_COLUMN_STATE,
    };
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

      let globalStaffingWithImportance = globalStaffing.map((staff) => ({
        ...staff,
        importance: getStaffingImportance(
          staff,
          getImportanceLookup(formattedWeeks)
        ),
      }));
      let globalProjectsWithImportance = globalProjects.map((staff) => ({
        ...staff,
        importance: getProjectImportance(
          staff,
          getImportanceLookup(formattedWeeks)
        ),
      }));

      updateFilterStorage(LOCAL_FILTERS.COMPANIES, companiesSelection);
      updateFilterStorage(LOCAL_FILTERS.POSITIONS, positionSelection);

      if (this.state.isSortedByImportance) {
        globalStaffingWithImportance = sortByImportance(
          globalStaffingWithImportance
        );
        globalProjectsWithImportance = sortByImportance(
          globalProjectsWithImportance
        );
      }

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
        : sortByImportance(this.state.globalStaffing),
      globalProjects: this.state.isSortedByImportance
        ? _.orderBy(this.state.globalProjects, ["_name"], ["asc"])
        : sortByImportance(this.state.globalProjects),
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

    this.setState({
      positions: newPositions,
    });
  }

  toggleTableColumn(targetTableColumn) {
    const newTableColumns = [...this.state.tableColumns].map((tableColumn) => ({
      ...tableColumn,
      isSelected:
        tableColumn.name === targetTableColumn
          ? !tableColumn.isSelected
          : tableColumn.isSelected,
    }));

    this.setState({ tableColumns: newTableColumns });
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
            setState={this.setState.bind(this)}
            positionsState={this.state.positions}
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
            toggleTableColumn={this.toggleTableColumn.bind(this)}
            tableColumns={this.state.tableColumns}
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
              </div>

              <StaffingTable
                peopleStaffing={staffingToDisplay}
                onRowClick={this.onStaffingTableRowClick.bind(this)}
                weeks={this.state.weeks}
                tableColumns={this.state.tableColumns}
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
