const Joi = require("joi")
const mongoose = require("mongoose")

const lenMin = 4
const lenMax = 255

const collection_name = "users"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: lenMin,
      maxlength: lenMax,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      minlength: lenMin,
      maxlength: lenMax,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: lenMin,
      maxlength: lenMax,
    },
    admin: {
      type: Boolean,
    },
  },
  { collection: collection_name }
)

const User = mongoose.model("User", userSchema)

const validateUser = bodyUser => {
  const schema = Joi.object({
    name: Joi.string().min(lenMin).max(lenMax).required(),
    email: Joi.string().min(lenMin).max(lenMax).required().email(),
    password: Joi.string().min(lenMin).max(lenMax).required(),
  })
  return schema.validate(bodyUser)
}

const validateRequest = req => {
  const schema = Joi.object({
    email: Joi.string().min(lenMin).max(lenMax).required().email(),
    password: Joi.string().min(lenMin).max(lenMax).required(),
  })

  return schema.validate(req)
}

exports.User = User
exports.validateUser = validateUser
exports.validateRequest = validateRequest
