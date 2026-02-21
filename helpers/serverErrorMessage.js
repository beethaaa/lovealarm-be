const serverErrorMessageRes = async (res, error) => {
  if (error.status) {
    return res.status(error.status).json({ message: error.message });
  }
  console.error(error);
  return res
    .status(500)
    .json({ message: "Unexpected error occur! Please comeback later!" });
};

module.exports = { serverErrorMessageRes };
