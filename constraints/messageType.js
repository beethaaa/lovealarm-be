const MESSAGE_TYPE ={
    TEXT:1,
    IMAGE:2,
    SYSTEM:3
}

const allowedMessageType = (type) => {
    return Object.values(MESSAGE_TYPE).find(item => item == type);
}

module.exports = {MESSAGE_TYPE,allowedMessageType}