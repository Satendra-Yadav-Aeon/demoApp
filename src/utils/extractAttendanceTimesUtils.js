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

export const parseHours = (str) => {
  if (str == null || str === '') return 0;
  // primary: treat as decimal hours (e.g. "0.05" => 0.05)
  const n = parseFloat(str);
  if (!Number.isNaN(n)) return n;

  // fallback: support "H:MM" if ever present
  if (typeof str === 'string' && str.includes(':')) {
    const [h = 0, m = 0] = str.split(':').map(Number);
    return (h || 0) + ((m || 0) / 60);
  }

  return 0;
};

export const calculateTotalHoursPerEmployeePerMonth = (data) => {
  const result = {};

  data.forEach(entry => {
    if (!entry?.checkin || !entry?.name) return;

    const [day, month, year] = entry.checkin.split(' ')[0].split('-'); // DD-MM-YYYY
    if (!day || !month || !year) return;

    // const empInitial = entry.name.slice(0, 3).toLowerCase(); // vas
    const empInitial = entry.name.toLowerCase();
    const key = `${empInitial}-${year}-${month}`;

    if (!result[key]) {
      result[key] = {
        label: key,
        totalHours: 0,
      };
    }

    result[key].totalHours += parseHours(entry.total_hrs || "0.00");
  });

  // Convert to array
  return Object.values(result);
};

export const prepareTaskChartData = (taskData) => {
  const grouped = {};

  taskData.forEach(task => {
    const date = task.startdate.split(" ")[0]; // e.g. "11-07-2025"
    const key = `${task.name}-${date}`;

    if (!grouped[key]) grouped[key] = { name: task.name, date, Finished: 0, Working: 0, Cancelled: 0 };

    if (task.status.toLowerCase().includes("finish")) grouped[key].Finished++;
    else if (task.status.toLowerCase().includes("work")) grouped[key].Working++;
    else if (task.status.toLowerCase().includes("cancel")) grouped[key].Cancelled++;
  });

  const labels = Object.values(grouped).map(item => `${item.name.slice(0,3).toLowerCase()}-${item.date.slice(0,5)}`);
  const finished = Object.values(grouped).map(item => item.Finished);
  const working = Object.values(grouped).map(item => item.Working);
  const cancelled = Object.values(grouped).map(item => item.Cancelled);

  return { labels, datasets: [finished, working, cancelled] };
};
