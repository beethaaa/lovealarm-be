const { serverErrorMessageRes } = require("../helpers/serverErrorMessage");
const Block = require("../models/Block");

const checkBlocked = async (userId1, userId2) => {
  const block = await Block.find({$or:[
    {blocker: userId1, blocked: userId2},
    {blocker: userId2, blocked: userId1}
  ]});

  if(block.length === 0) return 0; // no blocked between userId1 and userId2
  else if(block.length === 1){
    return block[0].blocker.toString() === userId1? 1 : 2; // 1: userId1 blocked userId2, 2: userId2 blocked userId1
  }
  else 
    return 3 // multually blocked
}

const createBlockLink = async (req, res) => {
  try {
    const userId = req.userId;
    const { blockedId } = req.body;

    // 1. Check if blockedId is provided
    if (!blockedId) {
      return res
        .status(400)
        .json({ success: false, message: "blockedId is required" });
    }

    // 2. Check if user is trying to block themselves
    if (userId === blockedId) {
      return res
        .status(400)
        .json({ success: false, message: "You cannot block yourself" });
    }

    const existedBlock = await Block.find({
      blocker: userId,
      blocked: blockedId,
    });
    if (existedBlock.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "This user is already been blocked" });
    }

    const newBlock = await Block.create({
      blocker: userId,
      blocked: blockedId,
    });
    res
      .status(201)
      .json({
        success: true,
        message: "User blocked successfully",
        data: newBlock,
      });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

const deleteBlockLinks = async (req, res) => {
  try{
    const userId = req.userId;
    const {blockedId} = req.body;

    if(!blockedId){
      return res
        .status(400)
        .json({ success: false, message: "blockedId is required" });
    }
  }catch(error){
    serverErrorMessageRes(res, error);
  }
}
