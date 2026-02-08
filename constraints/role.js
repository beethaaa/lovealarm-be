export const ROLE = {
  ADMIN: {
    key: 1,
    name: "System admin",
  },
  USER: {
    key: 2,
    name: "User",
  },
};

export const getRoleNameByKey = (key) => {
  const match = Object.values(ROLE).find((item) => item.key === key);
  if (!match) throw new Error("This role doesn't exist! Please check roleId!");
  return match.name;
};
