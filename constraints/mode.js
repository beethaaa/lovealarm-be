export const MODE = {
  SINGLE: {
    key: 1,
    name: "Single mode",
  },
  COUPLE: {
    key: 2,
    name: "Couple mode",
  },
};

export const getModeNameByKey = (key) => {
  const match = Object.values(MODE).find((item) => item.key === key);
  if (!match) throw new Error("This mode doesn't exist! Please check modeId!");
  return match.name;
}