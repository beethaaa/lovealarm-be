const checkRequiredFields = (...fields) => {
  return (req, res, next) => {
    for (const field of fields) {
      if (req.body[field] === undefined) {
        return res.status(400).json({
          message: `${field} is required!`,
        });
      }
    }
    next();
  };
};

module.exports = { checkRequiredFields };
