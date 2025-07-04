import moment from 'moment';
import { DATE_FORMAT_A } from '../constants/MainConstant';

export const getTodayFormatted = () => moment().format(DATE_FORMAT_A);
