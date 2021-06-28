export enum BookFormatType {
  Physical,
  Audio,
  Electronic,
  Other,
}

export type statusOption = {
  text: string;
  value: BookFormatType;
};

export const bookFormatWithValues: { [key: string]: statusOption } = {
  physical: {
    text: 'Physical',
    value: BookFormatType.Physical,
  },
  audio: {
    text: 'Audio',
    value: BookFormatType.Audio,
  },
  electronic: {
    text: 'Electronic',
    value: BookFormatType.Electronic,
  },
  other: {
    text: 'Other',
    value: BookFormatType.Other,
  },
};

export const bookFormatSelectOptions = Object.keys(bookFormatWithValues).map(
  status => ({
    text: bookFormatWithValues[status].text,
    value: bookFormatWithValues[status].value,
  }),
);
