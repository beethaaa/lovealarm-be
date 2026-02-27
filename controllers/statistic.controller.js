const { ROLE } = require("../constraints/role");
const { serverErrorMessageRes } = require("../helpers/serverErrorMessage");
const User = require("../models/User");

function calculatePercentages(data) {
  const result = {};

  for (const key in data) {
    const total = data[key].reduce((sum, item) => sum + item.count, 0);

    result[key] = data[key].map((item) => ({
      ...item,
      percent:
        total === 0 ? 0 : Number(((item.count / total) * 100).toFixed(2)),
    }));
  }

  return result;
}

const getStatisticByGenderAgeMode = async (req, res) => {
  const ageBoundaries = [0, 18, 26, 35, 56];
  try {
    const counts = await User.aggregate([
      {
        $match: {
          roleKey: ROLE.USER.key,
        },
      },
      {
        $facet: {
          gender: [
            {
              $group: {
                _id: "$profile.gender",
                count: { $sum: 1 },
              },
            },
          ],
          mode: [
            {
              $group: {
                _id: "$mode",
                count: { $sum: 1 },
              },
            },
          ],
          age: [
            {
              $addFields: {
                age: {
                  $dateDiff: {
                    startDate: "$profile.birthday",
                    endDate: "$$NOW",
                    unit: "year",
                  },
                },
              },
            },
            {
              $bucket: {
                groupBy: "$age",
                boundaries: ageBoundaries,
                default: "Other",
                output: {
                  count: { $sum: 1 },
                },
              },
            },
          ],
        },
      },
    ]);

    res.status(200).json(calculatePercentages(counts[0]));
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

const getStatisticByUserNumber = async (req, res) => {
  // Thống kê số lượng user hoạt động hôm nay
  try {
    const users = await User.aggregate([
      {
        $facet: {
          users: [{ $match: {} }],
          activeUsers: [
            {
              $addFields: {
                days: {
                  $dateDiff: {
                    startDate: "$lastLogin",
                    endDate: "$$NOW",
                    unit: "day",
                  },
                },
              },
            },
            {
              $match: {
                days: {
                  $lte: 0,
                },
              },
            },
          ],
        },
      },
    ]);
    const totalUsers = users[0]["users"].length;
    const activeUsers = users[0]["activeUsers"].length;

    res.status(200).json({
      totalUsers,
      activeUsers,
      activePercent: Number(((activeUsers / totalUsers) * 100).toFixed(2)),
    });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

module.exports = {
  getStatisticByGenderAgeMode,
  getStatisticByUserNumber,
};
