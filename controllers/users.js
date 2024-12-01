const gravatar = require("gravatar");
const Jimp = require("jimp");
const path = require("path");
const fs = require("fs");
const User = require("../models/user");
const multer = require("multer");

const avatarsDir = path.join(__dirname, "../public/avatars");

const updateAvatar = async (req, res, next) => {
  try {
    const { path: tempPath, originalname } = req.file;
    const { _id: userId } = req.user;

    const newAvatarName = `${userId}_${originalname}`;
    const resultPath = path.join(avatarsDir, newAvatarName);

    const avatar = await Jimp.read(tempPath);
    await avatar.resize(250, 250).writeAsync(resultPath);

    await fs.unlink(tempPath);

    const avatarURL = `/avatars/${newAvatarName}`;
    await User.findByIdAndUpdate(userId, { avatarURL });

    res.status(200).json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

module.exports = { updateAvatar };
