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

const startOfWeek = (date, firstDay = 0) => {
  firstDay = firstDay < 0 || firstDay > 6 ? 0 : firstDay;

  let day = date.getDay();
  let calendarStart = new Date(date);

  let diff = calendarStart.getDate() - day + ((day === 0 ? -7 : 0) + firstDay);
  calendarStart.setDate(diff);

  return calendarStart > date
    ? calendarStart.setDate(calendarStart.getDate() - 7)
    : calendarStart;
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

export default {
  names,
  startOfWeek,
  calendarMonth,
  lastDateOfMonth,
  firstDateOfMonth
};
