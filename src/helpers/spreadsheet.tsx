import { orderBy } from 'lodash';
import { buildProjects, buildStaffing, removePastWeeks } from './formatter';

/**
 * Get the user authentication status
 */
export function checkAuth(immediate: boolean, callback: (authResult: any) => void) {
  window.gapi.auth.authorize(
    {
      client_id: process.env.clientId,
      scope: process.env.scope,
      immediate,
    },
    callback
  );
}

type SyncStatusCallback = [
  syncStatus: boolean | null,
  error?: string,
]

export function getSyncStatus(callback: (...args: SyncStatusCallback) => void) {
  window.gapi.client.load('sheets', 'v4', () => {
    window.gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: process.env.spreadsheetId,
      range: 'Metadata!A:AV',
    }).then(
      (response) => {
        console.log('[Sync Response]', response);
        const statusValue = response.result.values[1][0]
        ? response.result.values[1][0] : '';
        const isSyncing = statusValue === 'running';
        callback(isSyncing);
      },
      (response) => {
        callback(null, response.result.error);
      }
    )
  })
}

export function scheduleUpdate() {
  window.gapi.client.load('sheets', 'v4', () => {
    window.gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: process.env.spreadsheetId,
      range: 'Metadata!A3',
      resource: {
        values: [['UPDATE_SCHEDULED']],
      },
      valueInputOption: 'RAW',
    }).then((response) => {
      console.log(response);
    })
  })
}

type LoadCallback = [
  weeks: any,
  globalStaffing: any,
  companies: any,
  positions: any,
  globalProjects: any,
  lastUpdated: any,
  error?: string,
]

/**
 * Load the content from the spreadsheet
 */
export function load(callback: (...args: LoadCallback) => void) {
  window.gapi.client.load('sheets', 'v4', () => {
    window.gapi.client.sheets.spreadsheets.values.batchGet(
      {
        spreadsheetId: process.env.spreadsheetId,
        ranges: [
          'StaffingView!A:AV',
          'ProjectView!A:AV',
          'Metadata!A:AV',
        ],
      }
    ).then(
      (response) => {
        console.log('[Response]', response);

        const staffingRows = response.result.valueRanges[0].values || [];
        const projectRows = response.result.valueRanges[1].values || [];

        const lastUpdated = response.result.valueRanges[2].values
        ? response.result.valueRanges[2].values[0][0] : '';

        let weeks = staffingRows[1].slice(4);

        let globalStaffing = buildStaffing(staffingRows as [][]);
        let globalProjects = buildProjects(projectRows as [][]);

        globalStaffing = orderBy(globalStaffing, ['company', '_name'], ['asc', 'asc']);
        console.log('[Staffing]', globalStaffing);

        globalProjects = orderBy(globalProjects, ['_name'], ['asc']);
        console.log('[Projects]', globalProjects);

        const companies = Array.from(new Set(globalStaffing.map((staffing) => { return staffing.company }).filter((company) => { return company !== undefined && company !== 'BU' })));
        console.log('[Companies]', companies);

        const positions = Array.from(new Set(globalStaffing.map((staffing) => { return staffing.position }).filter((position) => { return position !== undefined && position !== 'Position' })));
        console.log('[Positions]', positions);

        weeks = removePastWeeks(weeks);
        console.log('[Weeks]', weeks);

        callback(
          weeks,
          globalStaffing,
          companies,
          positions,
          globalProjects,
          lastUpdated
      );
      },
      (response) => {
        callback(null, null, null, null, null, null, response.result.error);
      }
    )
  })
}
