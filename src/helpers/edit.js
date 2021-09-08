import { findIndex, map } from 'lodash'

export function toggleByPeopleRow(peopleRow, data) {
  if (!peopleRow) {
    return data
  }

  const index = findIndex(data, (row) => {
    return row.name === peopleRow.name || row.name === peopleRow._name
  })

  if (index !== -1) {
    if (data[index].isOpen) {
      data[index].isOpen = false
      data.splice(index + 1, data[index].projects.length)
    } else {
      const newRows = map(data[index].projects, (project) => {
        return {
          name: '',
          staffing: data[index].staffing,
          company: data[index].company,
          position:  data[index].position,
          project,
          _name: data[index].name,
        }
      })

      data[index].isOpen = true
      data.splice(index + 1, 0, ...newRows)
    }
  }

  return data
}
