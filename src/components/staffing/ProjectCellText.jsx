import React from "react";
import { MAP_PROJECT_NAMES } from "../../constants";

export default class ProjectCellText extends React.Component {
  // static propTypes = {
  //   currentProjects: React.PropTypes.array.isRequired,
  //   upcomingProjects: React.PropTypes.array.isRequired,
  // };

  render() {
    const { currentProjects, upcomingProjects } = this.props;
    const renamedCurrentProjects = currentProjects.map((project) => {
      return MAP_PROJECT_NAMES[project] ? MAP_PROJECT_NAMES[project] : project;
    });
    const currentProjectsText = renamedCurrentProjects.join(", ");
    const separator =
      currentProjects.length > 0 && upcomingProjects.length > 0 ? ", " : "";
    const renamedUpcomingProjects = upcomingProjects.map((project) => {
      return MAP_PROJECT_NAMES[project] ? MAP_PROJECT_NAMES[project] : project;
    });
    const upcomingProjectsText = renamedUpcomingProjects.join(", ");

    return (
      <div>
        <b>{currentProjectsText}</b>
        {separator}
        {upcomingProjectsText}
      </div>
    );
  }
}
