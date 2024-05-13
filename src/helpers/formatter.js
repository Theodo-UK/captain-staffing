import { tail, forEach, map, groupBy, filter } from "lodash";
import moment from "moment";

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
  projectId: 5,
};

const STAFFING_ALERT_THRESHOLD = 10;
const STAFFING_CRISIS_THRESHOLD = 5;

const getArrayFromColumnId = (rows, index) =>
  Array.from(
    new Set(rows.map((row) => row[index]).filter((item) => item !== undefined))
  );

const getCompany = (rows, columnIndex) => {
  if (Array.isArray(rows)) {
    const companies = getArrayFromColumnId(rows, columnIndex);
    if (companies.length === 0) return "Other";
    return companies[0];
  }
  return "Other";
};

const getPosition = (rows, columnIndex) => {
  if (Array.isArray(rows)) {
    const positions = getArrayFromColumnId(rows, columnIndex);
    if (positions.length === 0) return "Other";
    return positions[0];
  }
  return "Other";
};

const getId = (rows, columnIndex) => {
  if (Array.isArray(rows)) {
    const ids = getArrayFromColumnId(rows, columnIndex);
    if (ids.length === 0) return "Other";
    return ids[0];
  }
  return "Other";
};

const hasAvailabiltiesFromWeekNumber = (staffing, weekNumber) =>
  !Object.keys(staffing)
    .sort()
    .slice(0, weekNumber)
    .reduce((acc, val) => staffing[val]._total >= 5 && acc, true);

export function unMergeCells(data, columnIndex) {
  let buffer = null;

  forEach(data, (row) => {
    if (row[columnIndex]) {
      buffer = row[columnIndex];
    } else {
      row[columnIndex] = buffer;
    }
  });

  return data;
}

export function getFloat(string) {
  if (string) {
    return parseFloat(string.replace(",", "."));
  }
  return null;
}

export function buildWeekStaffing(rows, weekIndex, columnIndex) {
  const weekStaffing = {};
  let total = null;

  forEach(rows, (row) => {
    const projectStaffing = getFloat(row[weekIndex + 4]);
    weekStaffing[row[columnIndex]] = projectStaffing;

    if (projectStaffing !== null) {
      total += projectStaffing;
    }
  });

  weekStaffing._total = total;
  return weekStaffing;
}

export function buildStaffing(peopleResponse, weeks) {
  const staffingArray = unMergeCells(tail(peopleResponse), 0);
  const staffingByName = groupBy(
    staffingArray,
    (someoneStaffing) => someoneStaffing[0]
  );

  return map(staffingByName, (rows, name) => {
    const staffing = {};
    forEach(weeks, (week, weekIndex) => {
      const weekString = moment(week, "DD/MM/YYYY").format("YYYY/MM/DD");
      staffing[weekString] = buildWeekStaffing(
        rows,
        weekIndex,
        staffingColumnToIndex.project
      );
    });

    const projects = map(rows, (row) => row[staffingColumnToIndex.project]);

    const isInStaffingAlert = hasAvailabiltiesFromWeekNumber(
      staffing,
      STAFFING_ALERT_THRESHOLD
    );
    const isInStaffingCrisis = hasAvailabiltiesFromWeekNumber(
      staffing,
      STAFFING_CRISIS_THRESHOLD
    );

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

export function buildProjects(projectResponse, weeks) {
  const staffingArray = unMergeCells(tail(projectResponse), 0);
  const staffingByProject = groupBy(
    staffingArray,
    (projectName) => projectName[0]
  );

  return map(staffingByProject, (rows, name) => {
    const staffing = {};
    forEach(weeks, (week, weekIndex) => {
      const weekString = moment(week, "DD/MM/YYYY").format("YYYY/MM/DD");
      staffing[weekString] = buildWeekStaffing(
        rows,
        weekIndex,
        projectColumnToIndex.user
      );
    });

    const users = map(rows, (row) => ({
      user: row[projectColumnToIndex.user],
      userId: row[projectColumnToIndex.userId],
      company: row[projectColumnToIndex.company],
      position: row[projectColumnToIndex.position],
    }));

    const companies = Array.from(
      new Set(map(rows, (row) => row[projectColumnToIndex.company]))
    );

    const project_id = rows[0][projectColumnToIndex.projectId];

    return {
      name,
      _name: name,
      staffing,
      users,
      companies,
      project_id,
    };
  });
}

export function removePastWeeks(weeks) {
  return filter(
    weeks,
    (week) => moment(week, "DD/MM/YYYY") > moment().subtract(7, "days")
  );
}
