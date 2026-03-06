const CONVERSATION_STATUS = {
  TEMP: 1,
  COUPLE: 2,
};

const allowedStatus = (statusCode) => {
  return  Object.values(CONVERSATION_STATUS).find((item) => item == statusCode)
}

module.exports = {CONVERSATION_STATUS,allowedStatus};

