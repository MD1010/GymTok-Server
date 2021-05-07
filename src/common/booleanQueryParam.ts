export const parseQueryParam = (value) => {
  console.log("value", value);

  if (!value) return undefined;
  return ["1", 1, "true", true].includes(value);
};
