const express = require("express");
const verifyRoles = require("../../middlewares/roleMiddleware");
const { ROLE } = require("../../constraints/role");

const {
  getStatisticByGenderAgeMode,
  getStatisticByUserNumber,
} = require("../../controllers/statistic.controller");
const router = express.Router();

router.route("/gender-age-mode").get(
  // #swagger.tags = ['Statistic']
  // #swagger.summary = 'Get statistic group by age, gender, mode'
  // #swagger.security = [{ "bearerAuth": [] }]
  verifyRoles(ROLE.ADMIN),
  getStatisticByGenderAgeMode,
);
router.route("/active-users").get(
  // #swagger.tags = ['Statistic']
  // #swagger.summary = 'Get statistic of active users'
  // #swagger.security = [{ "bearerAuth": [] }]
  verifyRoles(ROLE.ADMIN),
  getStatisticByUserNumber,
);

module.exports = router;
