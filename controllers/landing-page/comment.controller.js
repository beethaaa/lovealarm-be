const { serverErrorMessageRes } = require("../../helpers/serverErrorMessage");
const Comment = require("../../models/landing-page/Comment");

const postComment = async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment || comment.trim().length <= 0) {
      return res.status(400).json({ message: "Comment must be provided!" });
    }
    await Comment.create({ comment });
    return res.status(201).json({ message: "Comment posted successfully!" });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 });
    return res.status(200).json({ comments });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found!" });
    }
    await Comment.deleteOne({ _id: id });
    return res.status(200).json({ message: "Comment deleted successfully!" });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

module.exports = { postComment, getComments, deleteComment };
