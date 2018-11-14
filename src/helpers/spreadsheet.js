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
          'People - Architects!A1:AV86',
          'People - Agile Coaches!A1:AV86',
        ],
      }
    ).then(
      (response) => {
        const rows = response.result.valueRanges[0].values || []
        let weeks = tail(tail(head(rows)))
        const architectStaffing = buildStaffing(response.result.valueRanges[0].values)
        const agileCoachInput = response.result.valueRanges[1].values
        agileCoachInput.shift()
        const agileCoachStaffing = buildStaffing(agileCoachInput)

        weeks = removePastWeeks(weeks)

        callback(weeks, architectStaffing, agileCoachStaffing)
      },
      (response) => {
        callback(null, null, response.result.error)
      }
    )
  })
}

/**
 * Update a single cell value
 */
export function updateCell(column, row, value, successCallback, errorCallback) {
  window.gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: config.spreadsheetId,
    range: `Sheet1!${column}${row}`,
    valueInputOption: 'USER_ENTERED',
    values: [[value]],
  }).then(successCallback, errorCallback)
}
