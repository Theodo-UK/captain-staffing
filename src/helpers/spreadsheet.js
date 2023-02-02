import { orderBy } from 'lodash'

import config from '../configs/config'
import { buildProjects, buildStaffing, removePastWeeks } from './formatter'

/**
 * Get the user authentication status
 */
export function checkAuth(immediate, callback) {
  window.gapi.auth.authorize(
    {
      client_id: config.clientId,
      scope: config.scope,
      immediate,
    },
    callback
  )
}

export function getSyncStatus(callback) {
  window.gapi.client.load('sheets', 'v4', () => {
    window.gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: config.spreadsheetId,
      range: 'Metadata!A:AV',
    }).then(
      (response) => {
        console.log('[Sync Response]', response)
        const statusValue = response.result.values[1][0]
        ? response.result.values[1][0] : ''
        const isSyncing = statusValue === 'running'
        callback(isSyncing)
      },
      (response) => {
        callback(null, response.result.error)
      }
    )
  })
}

export function scheduleUpdate() {
  window.gapi.client.load('sheets', 'v4', () => {
    window.gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: config.spreadsheetId,
      range: 'Metadata!A3',
      resource: {
        values: [['UPDATE_SCHEDULED']],
      },
      valueInputOption: 'RAW',
    }).then((response) => {
      console.log(response)
    })
  })
}

/**
 * Load the content from the spreadsheet
 */
export function load(callback) {
  window.gapi.client.load('sheets', 'v4', () => {
    window.gapi.client.sheets.spreadsheets.values.batchGet(
      {
        spreadsheetId: config.spreadsheetId,
        ranges: [
          'StaffingView!A:AV',
          'ProjectView!A:AV',
          'Metadata!A:AV',
        ],
      }
    ).then(
      (response) => {
        console.log('[Response]', response)

        const staffingRows = response.result.valueRanges[0].values || []
        const projectRows = response.result.valueRanges[1].values || []

        const lastUpdated = response.result.valueRanges[2].values
        ? response.result.valueRanges[2].values[0][0] : ''

        let weeks = staffingRows[1].slice(4)

        let globalStaffing = buildStaffing(staffingRows)
        let globalProjects = buildProjects(projectRows)


        globalStaffing = orderBy(globalStaffing, ['company', '_name'], ['asc', 'asc'])
        console.log('[Staffing]', globalStaffing)

        globalProjects = orderBy(globalProjects, ['_name'], ['asc'])
        console.log('[Projects]', globalProjects)

        const companies = Array.from(new Set(globalStaffing.map((staffing) => { return staffing.company }).filter((company) => { return company !== undefined && company !== 'BU' })))
        console.log('[Companies]', companies)

        const positions = Array.from(new Set(globalStaffing.map((staffing) => { return staffing.position }).filter((position) => { return position !== undefined && position !== 'Position' })))
        console.log('[Positions]', positions)

        weeks = removePastWeeks(weeks)
        console.log('[Weeks]', weeks)

        callback(
          weeks,
          globalStaffing,
          companies,
          positions,
          globalProjects,
          lastUpdated
        )
      },
      (response) => {
        callback(null, null, response.result.error)
      }
    )
  })
}
