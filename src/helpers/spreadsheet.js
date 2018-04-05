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
    window.gapi.client.sheets.spreadsheets.values.get(
      {
        spreadsheetId: config.spreadsheetId,
        range: 'People!A1:AV86',
      }
    ).then(
      (response) => {
        const rows = response.result.values || []
        let weeks = tail(tail(head(rows)))
        const peopleStaffing = buildStaffing(response.result.values)

        weeks = removePastWeeks(weeks)

        callback(weeks, peopleStaffing)
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
