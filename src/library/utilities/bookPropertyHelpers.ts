export const truncateString = (str: string, num: number) =>
  str ? (str.length > num ? str.slice(0, num) + '...' : str) : '';

export const combineAuthors = (authors: string[]): string =>
  authors ? (authors.length > 1 ? authors.join(', ') : authors[0]) : '';
