import { tail, head } from 'lodash'

import config from '../configs/config'
import { buildStaffing, removePastWeeks } from './formatter'

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

/**
 * Load the content from the spreadsheet
 */
export function load(callback) {
  window.gapi.client.load('sheets', 'v4', () => {
    window.gapi.client.sheets.spreadsheets.values.batchGet(
      {
        spreadsheetId: config.spreadsheetId,
        ranges: [
          'StaffingView!A1:AV2000'
        ],
      }
    ).then(
      (response) => {
        console.log('[Response]', response);

        const rows = response.result.valueRanges[0].values || []
        let weeks = rows[1].slice(3)

        const globalStaffing = buildStaffing(response.result.valueRanges[0].values)
        console.log('[Staffing]', globalStaffing);

        const companies = Array.from(new Set(globalStaffing.map(staffing => staffing.company).filter(company => company !== undefined && company !== 'BU')));
        console.log('[Companies]', companies);

        weeks = removePastWeeks(weeks)
        console.log('[Weeks]', weeks);

        callback(
          weeks,
          globalStaffing,
          companies
        )
      },
      (response) => {
        callback(null, null, response.result.error)
      }
    )
  })
}
