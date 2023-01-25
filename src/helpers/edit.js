import { findIndex, map } from 'lodash'

function isProjectStaffed(projectRow) {
  const projectName = projectRow.project
  const isStaffed = Object.keys(projectRow.staffing).reduce((acc, val) => {
    if (acc) return acc
    const projectStaffing = projectRow.staffing[val][projectName]
    if (projectStaffing !== null && projectStaffing > 0) {
      return true
    }
    return false
  }, false)
  return isStaffed
}

export function toggleByPeopleRow(peopleRow, data) {
  if (!peopleRow) {
    return data
  }

  const index = findIndex(data, (row) => {
    return row.name === peopleRow.name || row.name === peopleRow._name
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
    })
    const filteredRows = newRows.filter((row) => { return isProjectStaffed(row) })

    if (data[index].isOpen) {
      data[index].isOpen = false
      data.splice(index + 1, filteredRows.length)
    } else if (filteredRows.length !== 0) {
      data[index].isOpen = true
      data.splice(index + 1, 0, ...filteredRows)
    }
  }

  return data
}

export function toggleByProjectRow(projectRow, data) {
  if (!projectRow) {
    return data
  }

  const index = findIndex(data, (row) => {
    return row.name === projectRow.name || row.name === projectRow._name
  })

  if (index !== -1) {
    if (data[index].isOpen) {
      data[index].isOpen = false
      data.splice(index + 1, data[index].users.length)
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
      })

      data[index].isOpen = true
      data.splice(index + 1, 0, ...newRows)
    }
  }

  return data
}
