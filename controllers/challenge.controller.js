const { ROLE } = require("../constraints/role");
const { serverErrorMessageRes } = require("../helpers/serverErrorMessage");
const Challenge = require("../models/Challenge");
const User = require("../models/User");

const getAllChallenge = async (req, res) => {
  const today = new Date();
  try {
    const { roleKey, userId } = req;
    let challenges = [];
    if (roleKey === ROLE.ADMIN.key)
      challenges = await Challenge.find({ expiredAt: { $gt: today } });
    else {
      const user = await User.findById(userId);
      if (!user) return res.sendStatus(401);
      challenges = await Challenge.find({
        expiredAt: { $gt: today },
        mode: user.mode,
      });
    }
    res.status(200).json(challenges);
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

const addChallenge = async (req, res) => {
  /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            mode: { type: "number" },
                            title: { type: "string" },
                            rewardPoint: { type: "number" },
                            location: {
                                type: "object",
                                properties: {
                                    lat: { type: "number" },
                                    lng: { type: "number" },
                                    radiusMeters: { type: "number" },
                                    imageUrl: { type: "string" },
                                    name: { type: "string" }
                                }
                            },
                            expiredAt: { type: "string", format: "date-time" }
                        }
                    }
                }
            }
        } 
    */
  try {
    const {
      mode,
      title,
      rewardPoint,
      location: { lat, lng, radiusMeters, imageUrl, name },
      expiredAt,
    } = req.body;

    if (new Date(expiredAt).getTime() <= Date.now()) {
      return res.status(400).json({
        message: "Expired date must be greater than current time!",
      });
    }

    await Challenge.create({
      mode,
      title,
      rewardPoint,
      location: {
        lat,
        lng,
        radiusMeters,
        name,
        imageUrl,
      },
      expiredAt,
    });
    res.sendStatus(201);
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

const updateChallenge = async (req, res) => {
  /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            mode: { type: "number" },
                            title: { type: "string" },
                            rewardPoint: { type: "number" },
                            location: {
                                type: "object",
                                properties: {
                                    lat: { type: "number" },
                                    lng: { type: "number" },
                                    radiusMeters: { type: "number" },
                                    imageUrl: { type: "string" },
                                    name: { type: "string" }
                                }
                            },
                            expiredAt: { type: "string", format: "date-time" }
                        }
                    }
                }
            }
        } 
    */
  try {
    const { id } = req.params;
    const { expiredAt } = req.body;

    if (expiredAt && new Date(expiredAt).getTime() <= Date.now()) {
      return res.status(400).json({
        message: "Expired date must be greater than current time!",
      });
    }

    const updatedChallenge = await Challenge.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedChallenge) {
      return res.status(404).json({ message: "Challenge not found!" });
    }

    res.status(200).json(updatedChallenge);
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

const deleteChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedChallenge = await Challenge.findByIdAndDelete(id);

    if (!deletedChallenge) {
      return res.status(404).json({ message: "Challenge not found!" });
    }

    res.sendStatus(204);
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

module.exports = {
  getAllChallenge,
  addChallenge,
  updateChallenge,
  deleteChallenge,
};
