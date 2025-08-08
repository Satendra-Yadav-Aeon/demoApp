import moment from 'moment';

export const extractAttendanceTimes = (employeeAttendance) => {
  // Filter check-ins and check-outs
  const checkIns = employeeAttendance?.filter(entry => entry.inOut === 1);
  const checkOuts = employeeAttendance?.filter(entry => entry.inOut === 2);

  // Sort checkIns by time ascending, checkOuts by time descending
  checkIns?.sort((a, b) => moment(a.checkDate, 'DD-MM-YYYY HH:mm:ss') - moment(b.checkDate, 'DD-MM-YYYY HH:mm:ss'));
  checkOuts?.sort((a, b) => moment(b.checkDate, 'DD-MM-YYYY HH:mm:ss') - moment(a.checkDate, 'DD-MM-YYYY HH:mm:ss'));

  // Get first check-in and last check-out
  const firstCheckIn = checkIns?.length > 0 ? moment(checkIns[0].checkDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm') : '--';
  const lastCheckOut = checkOuts?.length > 0 ? moment(checkOuts[0].checkDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm') : '--';

  return {
    firstCheckIn,
    lastCheckOut,
  };
};


// Converts total_hrs string like "1.40" to float hours
export const parseHours = (str) => {
  const [hours, minutes] = str.split('.').map(Number);
  return hours + (minutes / 60);
};

export const calculateTotalHoursPerEmployeePerDate = (data) => {
  const result = {};

  data.forEach(entry => {
    const empId = entry.empid;
    const name = entry.name;
    const date = entry.checkin.split(' ')[0]; // extract only the date

    const key = `${empId}_${date}`;

    if (!result[key]) {
      result[key] = {
        empId,
        name,
        date,
        totalHours: 0,
      };
    }

    result[key].totalHours += parseHours(entry.total_hrs);
  });

  // Convert to array
  return Object.values(result);
};