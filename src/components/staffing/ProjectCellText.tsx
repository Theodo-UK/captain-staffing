import React from 'react'
import { MAP_PROJECT_NAMES } from '../../constants'

interface ProjectCellTextProps {
  currentProjects: unknown[]
  upcomingProjects: unknown[]
}

export default class ProjectCellText extends React.Component<ProjectCellTextProps> {
  render() {
    const { currentProjects, upcomingProjects } = this.props
    const renamedCurrentProjects = currentProjects.map(
      (project) => {
        return MAP_PROJECT_NAMES[project]
        ? MAP_PROJECT_NAMES[project]
        : project
      }
    )
    const currentProjectsText = renamedCurrentProjects.join(', ')
    const separator = currentProjects.length > 0 && upcomingProjects.length > 0 ? ', ' : ''
    const renamedUpcomingProjects = upcomingProjects.map(
      (project) => {
        return MAP_PROJECT_NAMES[project]
        ? MAP_PROJECT_NAMES[project]
        : project
      }
    )
    const upcomingProjectsText = renamedUpcomingProjects.join(', ')

    return (
      <div>
        <b>
          {currentProjectsText}
        </b>
        { separator }
        { upcomingProjectsText }
      </div>
    )
  }
}
