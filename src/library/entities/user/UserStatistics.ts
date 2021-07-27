import { BookFormatType } from 'src/library/types/BookFormatType';

export class UserStatistics {
  constructor(
    public listCount: number,
    public pagesReadCount: number,
    public listsCompletedCount: number,
    public booksReadCount: number,
    public booksOwned: { [key: number]: number },
  ) {}
}

export const flattenStatistics = (stats: UserStatistics) => {
  const { booksOwned: omit, ...rest } = stats;
  const result: { [key: string]: number } = { ...rest };
  for (const key in omit) {
    result[`booksOwned${key}`] = omit[key];
  }
  return result;
};

export const getUserStatisticLabelLookup: () => {
  [key: string]: string | ((key: number) => string);
} = () => {
  const result: { [key: string]: string } = {
    listCount: 'List(s)',
    pagesReadCount: 'Page(s) read',
    listsCompletedCount: 'List(s) completed',
    booksReadCount: 'Book(s) read',
  };
  result[`booksOwned${BookFormatType.Audio}`] = 'Audio book(s) owned';
  result[`booksOwned${BookFormatType.Electronic}`] = 'E-book(s) owned';
  result[`booksOwned${BookFormatType.Other}`] = 'Other book(s) owned';
  result[`booksOwned${BookFormatType.Physical}`] = 'Physical book(s) owned';

  return result;
};
