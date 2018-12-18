const names = {
  daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  days: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ],
  monthsShort: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ],
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]
};

const firstDateOfMonth = date => {
  if (!date) date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const lastDateOfMonth = date => {
  if (!date) date = new Date();
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

const shiftMonth = (date, shift) => {
  return new Date(date.setMonth(date.getMonth() - shift));
};

const startOfWeek = (date, firstDay = 0) => {
  firstDay = firstDay < 0 || firstDay > 6 ? 0 : firstDay;

  let day = date.getDay();
  let weekStart = new Date(date);

  let diff = weekStart.getDate() - day + ((day === 0 ? -7 : 0) + firstDay);
  weekStart.setDate(diff);

  return weekStart > date
    ? weekStart.setDate(weekStart.getDate() - 7)
    : weekStart;
};

const calendarMonth = (startDate, firstDay = 1) => {
  let month = [];
  let today = new Date().setHours(0, 0, 0, 0);
  startDate = startDate || new Date();
  let calendarDate = startOfWeek(startDate, firstDay);
  for (let weekNr = 0; weekNr < 6; weekNr++) {
    let week = [];

    for (let day = 0; day < 7; day++) {
      week.push({
        weekDay: day,
        date: calendarDate,
        isSunday: day === 0,
        isSaturday: day === 6,
        isWeekend: day === 0 || day === 6,
        monthDay: calendarDate.getDate(),
        isPast: calendarDate.getTime() < today,
        isToday: calendarDate.getTime() === today,
        isCurrentMonth: calendarDate.getMonth() === startDate.getMonth()
      });

      let nextDay = calendarDate.getDate() + 1;
      calendarDate = new Date(
        calendarDate.getFullYear(),
        calendarDate.getMonth(),
        nextDay,
        0,
        0,
        0
      );
    }

    month.push(week);
  }

  return month;
};

const padZeros = (n, td) => {
  var ns = n.toString(),
    l = ns.length,
    z = "";
  if (td > l) {
    for (var i = l; i < td; i++) {
      z += "0";
    }
  }
  return z + ns;
};

const yyyy_mm_dd = date => {
  // return a yyyy-mm-dd string for date object
  return date == null
    ? null
    : date.getFullYear() +
        "-" +
        padZeros(date.getMonth() + 1, 2) +
        "-" +
        padZeros(date.getDate(), 2);
};

const yyyymmdd = date => {
  // return a yyyymmdd string for date object (or yyyy-mm-dd date string)
  return date == null
    ? null
    : typeof date === "string"
      ? date.replace(/-/g, "")
      : date.getFullYear() +
        padZeros(date.getMonth() + 1, 2) +
        padZeros(date.getDate(), 2);
};

export default {
  names,
  firstDateOfMonth,
  lastDateOfMonth,
  shiftMonth,
  startOfWeek,
  calendarMonth,
  padZeros,
  yyyy_mm_dd,
  yyyymmdd
};
