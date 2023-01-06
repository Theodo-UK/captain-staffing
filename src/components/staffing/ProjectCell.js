import React from 'react'
import { Cell } from 'fixed-data-table'

export default class ProjectCell extends React.Component {
  static propTypes = {
    data: React.PropTypes.array.isRequired,
    field: React.PropTypes.string,
    rowIndex: React.PropTypes.number,
    onClick: React.PropTypes.func,
  };
  ignoredProjectNames = ['HOLIDAY', 'NO PROJECT NAME', 'Leave UK', 'NOTHERE'];

  render() {
    const { rowIndex, field, data, ...props } = this.props
    const currentWeek = Object.keys(data[rowIndex].staffing).sort()[0]
    const projects = data[rowIndex].projects
      ? data[rowIndex].projects.filter(
          (project) => { return !this.ignoredProjectNames.includes(project) }
        )
      : []
    const currentProjectStaffing = data[rowIndex].staffing[currentWeek]
      ? data[rowIndex].staffing[currentWeek]
      : []
    const currentProjects = projects.filter(
      (project) => { return currentProjectStaffing[project] > 0 }
    )
    const upcomingProjects = projects.filter(
      (project) => { return !currentProjects.includes(project) }
    )
    return (
      <Cell
        {...props}
        onClick={this.props.onClick.bind(this, data[rowIndex])}
        className="clickable"
      >
        <b>{currentProjects.join(', ')}</b>
        {currentProjects.length > 0 && upcomingProjects.length > 0 ? ', ' : ''}
        {upcomingProjects.join(', ')}
        {data[rowIndex].projects ? '' : data[rowIndex][field]}
      </Cell>
    )
  }
}
