const { Code } = require("../Schemas/codeSchema");
async function isUserPremium(userId) {
  const codes = await Code.find({
    "redeemedBy.id": userId.toString(),
  });
  return codes.length > 0;
}
module.exports = { isUserPremium };