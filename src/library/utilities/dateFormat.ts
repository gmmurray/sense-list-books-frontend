import dateFormat from 'dateformat';

const formatTypes: { [key: string]: string } = {
  longDate: 'longDate',
  paddedShortDate: 'paddedShortDate',
};

export const formatLongDate = (date: Date) =>
  dateFormat(date, formatTypes.longDate);

export const formatShortDate = (date: Date) =>
  dateFormat(date, formatTypes.paddedShortDate);
