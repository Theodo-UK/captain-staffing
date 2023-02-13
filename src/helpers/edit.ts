import { findIndex, map } from 'lodash';

interface RowData {
  name: string;
}

interface ProjectRowData {
  project: string;
  staffing: StaffingType;
}

interface StaffingType {
  week: string;
}

function isProjectStaffed(projectRow: ProjectRowData) {
  const { project: projectName } = projectRow
  const isStaffed = Object.keys(projectRow.staffing).some((week) => {
    // TODO: Fix projectName typing
    const projectStaffing: number = projectRow.staffing[week as keyof typeof projectRow.staffing][projectName];
    return projectStaffing !== null && projectStaffing > 0;
  })
  return isStaffed;
}

// TODO: what types are these what
export function toggleByPeopleRow(peopleRow, data) {
  if (!peopleRow) {
    return data;
  }

  const index = findIndex(data, (row: RowData) => {
    return row.name === peopleRow.name || row.name === peopleRow._name;
  })

  if (index !== -1) {
    const newRows = map(data[index].projects, (project) => {
      return {
        name: '',
        staffing: data[index].staffing,
        company: data[index].company,
        position: data[index].position,
        importance: data[index].importance,
        project,
        _name: data[index].name,
      }
    });
    const filteredRows = newRows.filter((row) => { return isProjectStaffed(row) });

    if (data[index].isOpen) {
      data[index].isOpen = false;
      data.splice(index + 1, filteredRows.length);
    } else if (filteredRows.length !== 0) {
      data[index].isOpen = true;
      data.splice(index + 1, 0, ...filteredRows);
    }
  }

  return data;
}

export function toggleByProjectRow(projectRow, data) {
  if (!projectRow) {
    return data;
  }

  const index = findIndex(data, (row: RowData) => {
    return row.name === projectRow.name || row.name === projectRow._name;
  })

  if (index !== -1) {
    if (data[index].isOpen) {
      data[index].isOpen = false;
      data.splice(index + 1, data[index].users.length);
    } else {
      const newRows = map(data[index].users, (userDetails) => {
        return {
          name: '',
          staffing: data[index].staffing,
          company: userDetails.company,
          position: userDetails.position,
          importance: data[index].importance,
          user: userDetails.user,
          userId: userDetails.userId,
          companies: data[index].companies,
          _name: data[index].name,
        }
      });

      data[index].isOpen = true;
      data.splice(index + 1, 0, ...newRows);
    }
  }

  return data;
}
