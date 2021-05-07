export const parseQueryParam = (value) => {
  if (value === undefined) return undefined;
  return ["1", 1, "true", true].includes(value);
};
