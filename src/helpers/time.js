import moment from 'moment';
import 'moment/locale/ru';

function getTime(date) {
  moment.lang('ru');
  var myDate = moment(date);
  return myDate.format('llll');
}

export default getTime;
