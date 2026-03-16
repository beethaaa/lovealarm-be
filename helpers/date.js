function addToDate(d, { days = 0, months = 0, years = 0 }) {
  const date = d;
  date.setFullYear(date.getFullYear() + years);
  date.setMonth(date.getMonth() + months);
  date.setDate(date.getDate() + days);

  return date;
}

function getDayDifference(date1, date2) {
  const diff = Math.abs(new Date(date2) - new Date(date1));
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

module.exports = { addToDate, getDayDifference };
