export const getArrayOfNumbers = (zeroBased: boolean, n: number) => {
  const numbers = [...Array(n).keys()];
  return zeroBased ? numbers : numbers.map(n => n + 1);
};

export const getNumbersOptionsArray = (zeroBased: boolean, n: number) =>
  getArrayOfNumbers(zeroBased, n).map(value => ({
    text: value.toString(),
    value: value,
  }));
