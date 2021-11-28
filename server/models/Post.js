const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
  title: { type: String, required: true},
  content: { type: String, required: true, },
  createdAt: {type: Date, default: Date.now},
  users: [{
    type: Types.ObjectId,
    ref: "User"
  }]
})

module.exports = model('Post', schema)
