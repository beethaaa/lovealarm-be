const MatchStatus = require("../constraints/matchStatus");
const Match = require("../models/Match");

const getMatchByUser = async (userId1, userId2) => {
  if (!userId1 || !userId2) {
    throw { status: 400, message: "Both user IDs are required" };
  }

  const matches = await Match.find({
    users: { $all: [userId1, userId2] },
  });

  console.log("matches found: ", matches.length);

  if (matches.length > 1) {
    console.warn(
      `WARNING: Found ${matches.length} matches for users ${userId1} and ${userId2}. Returning newest one.`
    );
    
    // Sort by createdAt, return newest
    const sortedMatches = matches.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    return sortedMatches[0];
  }

  // If exactly one or no matches exist, return first one (or undefined if none)
  return matches[0];
};

const handleCreateMatchForLoveRequest = async (userId1, userId2) => {
  if (!userId1 || !userId2) {
    throw { status: 400, message: "Both user IDs are required" };
  }

  const matches = await Match.find({
    users: { $all: [userId1, userId2] },
    matchStatus: { $ne: MatchStatus.ENDED }
  });
  
  console.log("matches found: ", matches.length);

  if (matches.length > 1) {
    console.warn(
      `WARNING: Found ${matches.length} non-ended matches for users ${userId1} and ${userId2}. Ending older ones...`
    );
    
    // Sort by createdAt, keep newest
    const sortedMatches = matches.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    const newestMatch = sortedMatches[0];
    
    // End all older matches
    for (let i = 1; i < sortedMatches.length; i++) {
      await editStatus(sortedMatches[i]._id, MatchStatus.ENDED);
      console.log(`Ended old match: ${sortedMatches[i]._id}`);
    }
    
    return newestMatch;
  }

  // If exactly one match exists, return it
  if (matches.length === 1) {
    return matches[0];
  }

  // If no match exists, create new one
  const newMatch = await Match.create({
    users: [userId1, userId2],
    matchStatus: MatchStatus.PENDING,
  });

  console.log("New match created: ", newMatch._id);
  return newMatch;
};


const editStatus = async (matchId, status) => {
  if (!matchId || !status) {
    throw { status: 400, message: "Match ID and status are required" };
  }
  const existingMatch = await Match.findById(matchId);
  if (!existingMatch) {
    throw { status: 404, message: "Match not found" };
  }
  const match = await Match.findByIdAndUpdate(
    matchId,
    { matchStatus: status },
    { new: true },
  );
  return match;
};

module.exports = { handleCreateMatchForLoveRequest, editStatus, getMatchByUser };
