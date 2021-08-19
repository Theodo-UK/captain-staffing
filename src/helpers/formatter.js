import { tail, forEach, map, groupBy, filter } from 'lodash'
import moment from 'moment'

const getCompany = (rows) => {
  if(Array.isArray(rows)){
    const companies = Array.from(
      new Set(
        rows.map(row => row[1]).filter(item => item !== undefined)
      )
    );
    if(companies.length === 0) return 'Other';
    return companies[0];
  }
  return 'Other';
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
    const projectStaffing = getFloat(row[weekIndex + 3])
    weekStaffing[row[2]] = projectStaffing

    if (projectStaffing !== null) {
      total += projectStaffing
    }
  })

  weekStaffing._total = total
  return weekStaffing
}

export function buildStaffing(peopleResponse) {
  const weeks = peopleResponse[1].slice(3)
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
      return row[2]
    })

    return {
      name,
      staffing,
      projects,
      company: getCompany(rows)
    }
  })
}

export function removePastWeeks(weeks) {
  return filter(weeks, (week) => {
    return moment(week, 'DD/MM/YYYY') > moment().subtract(7, 'days')
  })
}
