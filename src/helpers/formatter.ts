import { tail, forEach, map, groupBy, filter } from 'lodash'
import * as moment from 'moment'

const staffingColumnToIndex = {
  id: 1,
  company: 2,
  position: 3,
  project: 4,
};

const projectColumnToIndex = {
  user: 1,
  userId: 2,
  position: 3,
  company: 4,
};


export const subTypes = {
  Devs: ['Dev'],
  Lead: ['Architecte', 'Engineering Manager', 'Senior architect', 'VP Tech'],
  BizDev: ['CA / PO', 'Operations (Finance) ', 'DP / PM / AM', 'Marketing', 'Growth Team', 'Sales', 'Data Product Manager'],
  Designers: ['Lead Designer', 'Designer Confirmé', 'Designer Junior'],
  DevOps: ['LeadDevOps', 'DevOps', 'DevOps [FREE]', 'SecOps', 'LeadSecOps'],
  Data: ['Lead Data Scientist', 'Lead Data Engineer', 'Ingénieur IA'],
  Other: ['Externe', 'Head of Tribe', 'R&D', 'Evangelist', 'Dirigeant'],
};

export const columnTitles = {
  User: 'user',
  Company: 'company',
  Project: 'project',
  Calendar: 'calendar',
};

const STAFFING_ALERT_THRESHOLD = 10;
const STAFFING_CRISIS_THRESHOLD = 5;

// TODO: what is row's type
interface RowType {
  row: string[]
}

const getArrayFromColumnId = (rows: RowType[], index: number) => {
  return Array.from(
    new Set(
      rows.map((row) => { return row[index] }).filter((item) => { return item !== undefined }),
    ),
  );
}

const getCompany = (rows: RowType[], columnIndex: number) => {
  if (Array.isArray(rows)) {
    const companies = getArrayFromColumnId(rows, columnIndex);
    if (companies.length === 0) return 'Other';
    return companies[0];
  }
  return 'Other';
}

const getPosition = (rows: RowType[], columnIndex: number) => {
  if (Array.isArray(rows)) {
    const positions = getArrayFromColumnId(rows, columnIndex);
    if (positions.length === 0) return 'Other';
    return positions[0];
  }
  return 'Other';
}

// TODO: typings
const formatPositions = (options, positionSelectedPairs) => {
  return Object.entries(positionSelectedPairs).filter(
    ([position]) => {
      return options.includes(position)
    })
    .map(([position, isSelected]) => {
      return { label: position, value: position, children: [], checked: isSelected, id: position }
    })
}
export const getColumnFilter = (selected: string) => {
  return [
    {
      label: 'User',
      checked : selected.includes('User'),
    },
    {
      label: 'Company',
      checked : selected.includes('Company'),
    },
    {
      label: 'Project',
      checked : selected.includes('Project'),
    },
    {
      label: 'Calendar',
      checked : selected.includes('Calendar'),
    },
  ]
}

// TODO: typing
export const getPositionForFilter = (positionSelectedPairs, lastClicked?: string) => {
  const devPositions = formatPositions(subTypes.Devs, positionSelectedPairs)
  const leadPositions = formatPositions(subTypes.Lead, positionSelectedPairs)
  const bizDevPositions = formatPositions(subTypes.BizDev, positionSelectedPairs)
  const otherPositions = formatPositions(subTypes.Other, positionSelectedPairs)
  const designerPositions = formatPositions(subTypes.Designers, positionSelectedPairs)
  const devOpsPositions = formatPositions(subTypes.DevOps, positionSelectedPairs)
  const dataPositions = formatPositions(subTypes.Data, positionSelectedPairs)

  return {
    label: 'All',
    expanded: true,
    children: [
      {
        label: 'Devs',
        id: 'Devs',
        children: devPositions,
        checked: devPositions.every((position) => { return position.checked }),
        expanded: subTypes.Devs.includes(lastClicked),
      },
      {
        label: 'Lead',
        id: 'Lead',
        children: leadPositions,
        checked: leadPositions.every((position) => { return position.checked }),
        expanded: subTypes.Lead.includes(lastClicked),
      },
      {
        label: 'Biz Dev',
        id: 'Biz Dev',
        children: bizDevPositions,
        checked: bizDevPositions.every((position) => { return position.checked }),
        expanded: subTypes.BizDev.includes(lastClicked),
      },
      {
        label: 'Designers',
        id: 'Designers',
        children: designerPositions,
        checked: designerPositions.every((position) => { return position.checked }),
        expanded: subTypes.Designers.includes(lastClicked),
      },
      {
        label: 'Dev Ops',
        id: 'Dev Ops',
        children: devOpsPositions,
        checked: devOpsPositions.every((position) => { return position.checked }),
        expanded: subTypes.DevOps.includes(lastClicked),
      },
      {
        label: 'Data',
        id: 'Data',
        children: dataPositions,
        checked: dataPositions.every((position) => { return position.checked }),
        expanded: subTypes.Data.includes(lastClicked),
      },
      {
        label: 'Other',
        id: 'Other',
        children: otherPositions,
        checked: otherPositions.every((position) => { return position.checked }),
        expanded: subTypes.Other.includes(lastClicked),
      },
    ],
  }
}

const getId = (rows: [], columnIndex: number) => {
  if (Array.isArray(rows)) {
    const ids = getArrayFromColumnId(rows, columnIndex)
    if (ids.length === 0) return 'Other'
    return ids[0]
  }
  return 'Other'
}

// TODO: what type is staffing
const hasAvailabiltiesFromWeekNumber = (staffing, weekNumber: number) => {
  return !Object.keys(staffing)
    .sort()
    .slice(0, weekNumber)
    .reduce((acc, val) => { return staffing[val]._total >= 5 && acc }, true);
}

// TODO: what type is data here
export function unMergeCells(data, columnIndex: number) {
  let buffer: number;

  forEach(data, (row) => {
    if (row[columnIndex]) {
      buffer = row[columnIndex];
    } else {
      row[columnIndex] = buffer;
    }
  });

  return data;
}

export function getFloat(convertToFloat: string) {
  if (convertToFloat) {
    return parseFloat(convertToFloat.replace(',', '.'));
  }
  return null;
}

export function buildWeekStaffing(rows: RowType, weekIndex: number, columnIndex: number) {
  // TODO: need a better solution that this
  const weekStaffing = {} as any;
  let total: number = 0;

  forEach(rows, (row) => {
    const projectStaffing = getFloat(row[weekIndex + 4]);
    weekStaffing[row[columnIndex]] = projectStaffing;

    if (projectStaffing !== null) {
      total += projectStaffing;
    }
  })

  weekStaffing._total = total;
  return weekStaffing;
}

// TODO: what is peopleResponse AND FIX ROWS TYPE
export function buildStaffing(peopleResponse) {
  const weeks = peopleResponse[1].slice(4);
  const staffingArray = unMergeCells(tail(peopleResponse), 0);
  const staffingByName = groupBy(staffingArray, (someoneStaffing) => {
    return someoneStaffing[0]
  });

  return map(staffingByName, (rows: RowType, name: string) => {
    const staffing = {};
    forEach(weeks, (week, weekIndex: number) => {
      const weekString = moment(week, 'DD/MM/YYYY').format('YYYY/MM/DD');
      staffing[weekString] = buildWeekStaffing(rows, weekIndex, staffingColumnToIndex.project);
    });

    const projects = map(rows, (row) => {
      return row[staffingColumnToIndex.project];
    });

    const isInStaffingAlert = hasAvailabiltiesFromWeekNumber(staffing, STAFFING_ALERT_THRESHOLD);
    const isInStaffingCrisis = hasAvailabiltiesFromWeekNumber(staffing, STAFFING_CRISIS_THRESHOLD);

    return {
      name,
      _name: name,
      staffing,
      projects,
      isInStaffingAlert,
      isInStaffingCrisis,
      company: getCompany(rows, staffingColumnToIndex.company),
      position: getPosition(rows, staffingColumnToIndex.position),
      id: getId(rows, staffingColumnToIndex.id),
    };
  });
}

export function buildProjects(projectResponse) {
  const weeks = projectResponse[1].slice(4);

  const staffingArray = unMergeCells(tail(projectResponse), 0);
  const staffingByProject = groupBy(staffingArray, (projectName) => {
    return projectName[0];
  });

  return map(staffingByProject, (rows, name) => {
    const staffing = {};
    forEach(weeks, (week, weekIndex) => {
      const weekString = moment(week, 'DD/MM/YYYY').format('YYYY/MM/DD');
      staffing[weekString] = buildWeekStaffing(rows, weekIndex, projectColumnToIndex.user);
    });

    const users = map(rows, (row) => {
      return {
        user: row[projectColumnToIndex.user],
        userId: row[projectColumnToIndex.userId],
        company: row[projectColumnToIndex.company],
        position: row[projectColumnToIndex.position],
      };
    });

    const companies = Array.from(
      new Set(map(rows, (row) => { return row[projectColumnToIndex.company] })),
    );;

    return {
      name,
      _name: name,
      staffing,
      users,
      companies,
    };
  });
}

export function removePastWeeks(weeks) {
  return filter(weeks, (week) => {
    return moment(week, 'DD/MM/YYYY') > moment().subtract(7, 'days');
  });
};
