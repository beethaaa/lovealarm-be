const socket = require("../socket/socket");

const socketOwnerMap = new Map(); //socketId -> {userId, deviceId}
/* ****************************************
    This map tracks this socket belongs to which user and which device
    Socket structure: 
      Map<socketId, { userId, deviceId }>
    
    Example:
    Map {
    "socketABC" => { userId: "user123", deviceId: "iphone-id" },
    "socketXYZ" => { userId: "user123", deviceId: "ipad-id" },
    "socketDEF" => { userId: "user456", deviceId: "android-id" },
    }
    used when: socket disconnects → we know WHICH user+device to clean up
    */

const onlineUserDevice = new Map(); //userId -> Map(deviceId => set(socketId))

/* *****************************************
    Simple 1-device-per-user tracking
    Map<userId, { socketId, deviceId }>

    Example:
    Map {
      "user123" => { socketId: "socketABC", deviceId: "iphone-id" },
      "user456" => { socketId: "socketDEF", deviceId: "android-id" },
    }
    used when: 
    - send message → check if receiver is online → skip push if yes
    - new connection → kick old socket if same user connects from new device
*/

// Connect new device and return the socket of old device
const userConnect = (userId, socketId, deviceId) => {
  const uid = userId.toString();

  const onlineDevice = onlineUserDevice.get(uid); //get currently Online Device by user id : {socketId, deviceId}
  const oldSocketId = onlineDevice?.socketId; //return a socketId

  socketOwnerMap.set(socketId, { userId: uid, deviceId }); //add new socketId -> { userId, deviceId }
  onlineUserDevice.set(uid, { socketId, deviceId }); //add online connection

  return oldSocketId;
};

const isUserOnline = (userId) => {
  return onlineUserDevice.has(userId.toString());
};

const getOnlineUser = (userId) => {
  return onlineUserDevice.get(userId.toString());
};

const userDisconnect = (socketId) => {
  const userAndDevice = socketOwnerMap.get(socketId); // { userId, deviceId } or undefined

  if (!userAndDevice) return;

  socketOwnerMap.delete(socketId); //delete from socketOwnerMap

  //xóa onlineUser đang có socket như socketId đc đưa vô hàm
  const current = onlineUserDevice.get(userAndDevice.userId); //{socketId, deviceId} or undefined
  if (current?.socketId === socketId)
    onlineUserDevice.delete(userAndDevice.userId);
};

module.exports = {
  userConnect,
  isUserOnline,
  getOnlineUser,
  userDisconnect,
};
