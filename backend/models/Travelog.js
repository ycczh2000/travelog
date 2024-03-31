const mongoose = require("mongoose")
const User = require("./User")

const ObjectId = mongoose.Schema.Types.ObjectId

const travelogSchema = new mongoose.Schema({
  authorId: { type: ObjectId, ref: "User", required: true },
  createDate: { type: Date, default: Date.now },
  tags: [String],
  images: [String],
  title: { type: String, required: true },
  content: { type: String, required: true },
  deleted: { type: Boolean, default: false }, //逻辑删除
  audit: { type: Number, default: 0 }, //0:未审核 1:审核通过 -1:审核未通过
  auditDate: { type: Date },
  Location: { type: String, default: "" }, //地点 待细化

  likesCount: { type: Number, default: 0 },
  viewsCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },

  //较难实现的功能
  likes: [{ type: ObjectId, ref: "User" }],
  comments: [
    {
      authorId: { type: ObjectId, ref: "User", required: true },
      content: { type: String, required: true },
      date: { type: Date, default: Date.now },
      star: { type: Number, default: 0 },
    },
  ],
})

travelogSchema.statics.createTravelog = async function (authorId, log) {
  try {
    await this.create({ authorId, ...log })
    return { success: true, message: "创建成功" }
  } catch (err) {
    console.log("DB ERROR travelogSchema.statics.createTravelog:", err)
    return { success: false, message: "创建失败" }
  }
}

//获取我的游记列表
travelogSchema.statics.getMyTravelogs = async function (authorId) {
  try {
    const travelogs = await this.find({ authorId, deleted: false })
    return { success: true, data: travelogs }
  } catch (err) {
    console.log("DB ERROR travelogSchema.statics.getTravelogs:", err)
    return { success: false, message: "获取失败" }
  }
}

//获取单个游记
travelogSchema.statics.getTravelogById = async function (travelogId) {
  try {
    const travelog = await await this.findOne({ _id: travelogId, deleted: false })
      .select("-audit -auditDate -delete")
      .exec()
    if (!travelog) {
      return { success: false, message: "游记不存在" }
    }
    return { success: true, data: travelog }
  } catch (err) {
    console.log("DB ERROR travelogSchema.statics.getTravelogById:", err)
    return { success: false, message: "获取失败" }
  }
}

//获取某个用户的全部游记
travelogSchema.statics.getTravelogsByUsername = async function (username) {
  try {
    const user = await User.findOne({ username: username }).exec()
    if (!user) {
      return { success: false, message: "用户不存在" }
    }
    const travelogs = await this.find({ authorId: user._id, deleted: false }).select("-audit -auditDate -delete").exec()
    return { success: true, data: travelogs }
  } catch (err) {
    console.log("DB ERROR travelogSchema.statics.getTravelogsByUserId:", err)
    return { success: false, message: "获取失败" }
  }
}

const Travelog = mongoose.model("Travelog", travelogSchema)
module.exports = Travelog
