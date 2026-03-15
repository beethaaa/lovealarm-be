const Friend = require("../models/Friend");


const createFriendRecord = async (ownerId, friendId) => {
  
    if (!ownerId || !friendId)
      throw {status: 400, message:"Owner ID and Friend ID are required"};

    const newFriend = await Friend.create({
      ownerId,
      friendId,
    });
    return newFriend;
};


module.exports = {createFriendRecord}
