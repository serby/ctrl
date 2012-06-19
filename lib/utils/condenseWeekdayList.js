function condensedWeekdayList (weekdays) {
  var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    , ranges = []
    , nextDay = ''
    , start = false
    , end = false
    , index
    , output = []
    , i
    , weekday = ''
    ;

  for (i = 0; i < weekdays.length - 1; i++) {
    weekday = weekdays[i] || '';

    index = days.indexOf(weekday.substring(0, 3));
    if (start === false) {
      start = index;
    }
    if (weekdays[i + 1] !== days[index + 1]) {
      end = days.indexOf(weekday.substring(0, 3));
    }

    if (start !== false && end !== false) {
      ranges.push(days[start]);
      ranges.push(days[end]);
      start = false;
      end = false;
    }
  }

  if (!end) {
    ranges.push(days[start]);
    weekday = weekdays[i] || '';
    ranges.push(days[days.indexOf(weekday.substring(0, 3))]);
  }

  for (i = 0; i < ranges.length; i += 2) {
    if (ranges[i] === undefined) {
      output.push(ranges[i+1]);
    } else {
      if (ranges[i] === ranges[i+1]) {
        output.push(ranges[i]);
      } else {
        output.push(ranges[i] + '-' + ranges[i+1]);
      }
    }
  }
  return output.join(', ');
}

module.exports = condensedWeekdayList;