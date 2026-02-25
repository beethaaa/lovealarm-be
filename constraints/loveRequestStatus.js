const LoveRequestStatus = {
  PENDING: "PENDING",
  WAITING_START: "WAITING_START",
  WAITING_REPLY: "WAITING_REPLY",
};

const isValidLoveRequestStatus = (status) => {
  return Object.values(LoveRequestStatus).includes(status)
}

module.exports = {LoveRequestStatus, isValidLoveRequestStatus}