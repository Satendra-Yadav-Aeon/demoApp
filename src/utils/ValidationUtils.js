export const isNullOrEmpty = (value) => {
  return (
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim() === '') ||
    (Array.isArray(value) && value.length === 0)
  );
};

export const isArrayLength = (arr) => {
  return Array.isArray(arr) && arr.length > 0;
};
