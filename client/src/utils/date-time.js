import moment from 'moment';

const DateUtil = {

  format: (date, formatStr) => {
    return moment.isMoment(date) ? 
      date.format(formatStr ? formatStr : 'YYYY-MM-DD')
      : moment(date).format(formatStr ? formatStr : 'YYYY-MM-DD');
  },

  today: _ => {
    return moment().format('YYYY-MM-DD');
  },

  now: _ => {
    return moment().format('YYYY-MM-DD HH:mm:ss');
  },

  formatSecAsTime: seconds => {
    seconds = seconds || 0;
    let hours, hoursString, minutes, minutesString, secondsInt, secs, secondsStr;
    secondsInt = parseInt(seconds, 10) || 0;
    secs = parseInt(secondsInt % 60, 10);
    secondsStr = secs > 9 ? secs : '0' + secs;
    hours = parseInt(secondsInt / 60 / 60, 10);
    minutes = parseInt((secondsInt / 60) % 60, 10);
    hoursString = hours > 9 ? hours : '0' + hours;
    minutesString = minutes > 9 ? minutes : '0' + minutes;
    return hoursString + ':' + minutesString + ':' + secondsStr;
  }
}

export default DateUtil;
