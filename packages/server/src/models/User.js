import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true },
)

userSchema.pre('save', async function (next) {
  const user = this

  if (this.isModified('password') || this.isNew) {
    const hashedPassword = bcrypt.hashSync(user.password, SALT_ROUNDS)
    user.password = hashedPassword
    return next()
  }

  return next()
})

userSchema.post('save', function (user, next) {
  next()
})

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

const User = mongoose.model('User', userSchema)
export default User
