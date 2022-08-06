const asyncHandler = require("express-async-handler");
const User = require("../models/User");


//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const allUsers = asyncHandler(async (req, res) => {
  
  const keyword = req.query.search
    ? {
        $or: [
          { username: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.body.userId } });
  //const users=await User.find({username:req.query.search})
  res.send(users);
});



module.exports = { allUsers };