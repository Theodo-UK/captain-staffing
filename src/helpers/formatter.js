import { tail, forEach, map, groupBy, filter } from 'lodash'
import moment from 'moment'

const columnToIndex = {
  company: 1,
  position: 2,
  project: 3,
}

const getArrayForColumn = (rows, index) => {
  return Array.from(
    new Set(
      rows.map(row => row[index]).filter(item => item !== undefined),
    ),
  )
}

const getCompany = (rows) => {
  if (Array.isArray(rows)) {
    const companies = getArrayForColumn(rows, columnToIndex.company)
    if (companies.length === 0) return 'Other'
    return companies[0]
  }
  return 'Other'
}

const getPosition = (rows) => {
  if (Array.isArray(rows)) {
    const positions = getArrayForColumn(rows, columnToIndex.position)
    if (positions.length === 0) return 'Other'
    return positions[0] === 'Dev' ? 'Dev' : 'Lead'
  }
  return 'Other'
}

export function unMergeCells(data, columnIndex) {
  let buffer = null

  forEach(data, (row) => {
    if (row[columnIndex]) {
      buffer = row[columnIndex]
    } else {
      row[columnIndex] = buffer
    }
  })

  return data
}

export function getFloat(string) {
  if (string) {
    return parseFloat(string.replace(',', '.'))
  }
  return null
}

export function buildWeekStaffing(rows, weekIndex) {
  const weekStaffing = {}
  let total = null

  forEach(rows, (row) => {
    const projectStaffing = getFloat(row[weekIndex + 4])
    weekStaffing[row[columnToIndex.project]] = projectStaffing

    if (projectStaffing !== null) {
      total += projectStaffing
    }
  })

  weekStaffing._total = total
  return weekStaffing
}

export function buildStaffing(peopleResponse) {
  const weeks = peopleResponse[1].slice(4)
  const staffingArray = unMergeCells(tail(peopleResponse), 0)
  const staffingByName = groupBy(staffingArray, (someoneStaffing) => {
    return someoneStaffing[0]
  })

  return map(staffingByName, (rows, name) => {
    const staffing = {}
    forEach(weeks, (week, weekIndex) => {
      const weekString = moment(week, 'DD/MM/YYYY').format('DD/MM')
      staffing[weekString] = buildWeekStaffing(rows, weekIndex)
    })

    const projects = map(rows, (row) => {
      return row[columnToIndex.project]
    })

    return {
      name,
      staffing,
      projects,
      company: getCompany(rows),
      position: getPosition(rows),
    }
  })
}

export function removePastWeeks(weeks) {
  return filter(weeks, (week) => {
    return moment(week, 'DD/MM/YYYY') > moment().subtract(7, 'days')
  })
}
