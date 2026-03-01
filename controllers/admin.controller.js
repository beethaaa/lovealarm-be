const updateUserByAdmin = async (req, res) => {
  const userId = req?.params?.id;
  const updateDetail = req.body;
  
  try {
    // Admin might have fewer/different restrictions
    const adminNotAllowedField = [""]; // only password maybe?
    
    // Reuse buildUpdateObject with different restrictions
    const updateData = buildUpdateObject(updateDetail, adminNotAllowedField);
    if (updateData.error)
      return res.status(403).json({ success: false, message: updateData.error });
    
    // Rest of logic...
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};