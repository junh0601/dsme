export const getInnerTag = (text, tag) => {
  const removeTdRegex = new RegExp(`(<${tag}.*?>|<\/${tag}>)`, "g");
  if (typeof text === "string") {
    const result = text.replace(removeTdRegex, "");
    return result;
  } else if (typeof text === "object") {
    const result = [];
    text.forEach((i) => {
      const irslt = i.replace(removeTdRegex, "");
      result.push(irslt);
    });
    return result;
  }
};

export const csvParser = (csvContent) => {
  const rows = csvContent.split("\n");
  const result = [];
  rows.forEach((row) => {
    const cols = row.split(",");
    result.push(cols);
  });
  return result;
};
