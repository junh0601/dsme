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
