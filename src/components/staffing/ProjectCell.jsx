import React from "react";
import { Cell } from "fixed-data-table-2";
import { IGNORED_PROJECT_NAMES, MAP_PROJECT_NAMES } from "../../constants";
import ProjectCellText from "./ProjectCellText";

export default class ProjectCell extends React.Component {
  // static propTypes = {
  //   data: React.PropTypes.array.isRequired,
  //   field: React.PropTypes.string,
  //   rowIndex: React.PropTypes.number,
  //   onClick: React.PropTypes.func,
  // };

  render() {
    const { rowIndex, field, data, ...props } = this.props;
    const sortedWeeks = Object.keys(data[rowIndex].staffing);
    sortedWeeks.sort();
    const currentWeek = sortedWeeks[0];
    const projects = data[rowIndex].projects
      ? data[rowIndex].projects.filter((project) => {
          return !IGNORED_PROJECT_NAMES.includes(project);
        })
      : [];
    const currentProjectStaffing = data[rowIndex].staffing[currentWeek]
      ? data[rowIndex].staffing[currentWeek]
      : [];
    const currentProjects = projects.filter((project) => {
      return currentProjectStaffing[project] > 0;
    });
    const upcomingProjects = projects.filter((project) => {
      return !currentProjects.includes(project);
    });
    const isIndividualProject = data[rowIndex].projects === undefined;
    const individualProjectText = isIndividualProject
      ? data[rowIndex][field]
      : "";
    const individualProjectRenamedText = MAP_PROJECT_NAMES[
      individualProjectText
    ]
      ? MAP_PROJECT_NAMES[individualProjectText]
      : individualProjectText;
    const cellText = isIndividualProject ? (
      individualProjectRenamedText
    ) : (
      <ProjectCellText
        currentProjects={currentProjects}
        upcomingProjects={upcomingProjects}
      />
    );

    return (
      <Cell
        {...props}
        onClick={this.props.onClick.bind(this, data[rowIndex])}
        className="clickable"
      >
        {cellText}
      </Cell>
    );
  }
}
