function filterAllowedFields(body, allowedFields) {
  const result = {};

  allowedFields.forEach((path) => {
    if (body[path] !== undefined) {
      const keys = path.split(".");
      let current = result;

      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          current[key] = body[path];
        } else {
          current[key] = current[key] || {};
          current = current[key];
        }
      });
    }
  });

  return result;
}

module.exports = {
  filterAllowedFields,
};
