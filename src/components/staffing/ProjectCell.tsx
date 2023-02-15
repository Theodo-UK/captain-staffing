import React from 'react';
import { Cell } from 'fixed-data-table';
import { IGNORED_PROJECT_NAMES, MAP_PROJECT_NAMES } from '../../constants/index';
import ProjectCellText from './ProjectCellText';

interface ProjectCellProps {
  data: Array<{ [key: string]: any; }>;
  field?: string;
  rowIndex?: number;
  onClick?: (rowData: { [key: string]: any; }) => void;
}

export default class ProjectCell extends React.Component<ProjectCellProps> {
  render() {
    const { rowIndex, field, data, ...props } = this.props;
    const sortedWeeks = Object.keys(data[rowIndex].staffing);
    sortedWeeks.sort();
    const currentWeek = sortedWeeks[0];
    const projects = data[rowIndex].projects
      ? data[rowIndex].projects.filter(
        (project: string) => { return !IGNORED_PROJECT_NAMES.includes(project) }
      )
      : [];
    const currentProjectStaffing = data[rowIndex].staffing[currentWeek]
      ? data[rowIndex].staffing[currentWeek]
      : [];
    const currentProjects = projects.filter(
      (project: string) => { return currentProjectStaffing[project] > 0 }
    );
    const upcomingProjects = projects.filter(
      (project: string) => { return !currentProjects.includes(project) }
    );
    const isIndividualProject = data[rowIndex].projects === undefined;
    const individualProjectText = isIndividualProject ? data[rowIndex][field] : '';
    const individualProjectRenamedText = MAP_PROJECT_NAMES[individualProjectText as keyof typeof MAP_PROJECT_NAMES]
      ? MAP_PROJECT_NAMES[individualProjectText as keyof typeof MAP_PROJECT_NAMES]
      : individualProjectText;
    const cellText = isIndividualProject
      ? individualProjectRenamedText
      : (
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
