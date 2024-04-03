const express = require("express")
const router = express.Router()
const User = require("../models/User")
const { avatarImgUpload } = require("../middleware/imgUpload")
const jwt = require("jsonwebtoken")
let secret = "fawgf1awi7owa35"

router.post("/register", async (req, res) => {
  const { username, password } = req.body
  const result = await User.createUser(username, password)
  res.json(result)
})

router.post("/login", async (req, res) => {
  if (req.userId) {
    let result = await User.loginByToken(req.userId)
    res.json(result)
  } else {
    const { username, password } = req.body
    let result = await User.login(username, password)
    if (result.success) {
      const token = jwt.sign({ _id: result.data.userId }, secret, { expiresIn: "30h" })
      result.data.token = token
    }
    res.json(result)
  }
})

router.post("/uploadAvator", avatarImgUpload.single("image"), async (req, res) => {
  if (!req.userId) {
    return res.json({ success: false, message: "未登录" })
  }
  console.log(req.file)
  const { buffer, mimetype } = req.file
  const result = await User.uploadAvatar(req.userId, buffer, mimetype)
  res.json(result)
})

router.get("/getAvatar/:username", async (req, res) => {
  const username = req.params.username
  console.log(username)
  const result = await User.getAvatar(username)
  if (result.success) {
    const { avatar, type } = result.data
    res.type(type)
    res.send(avatar)
  } else {
    res.status(204).end()
  }
})

// app.get("/users/:userId/following", async (req, res) => {
//   const token = req.header("Authorization")?.split(" ")[1]
//   const out = jwt.verify(token, secret)
//   const id = out._id

//   const userId = req.params?.userId
//   const result = await User.getFollowing(userId)
//   res.json(result)
// })

module.exports = router