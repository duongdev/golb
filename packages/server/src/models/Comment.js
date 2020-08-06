import { Schema, Types, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      required: true,
      index: true,
      ref: 'User',
    },
    targetId: {
      type: Types.ObjectId,
      required: true,
      index: true,
    },
  },
  { timestamps: true, toJSON: { getters: true, virtuals: true } },
)

commentSchema.plugin(mongoosePaginate)

export const Comment = model('Comment', commentSchema)
export default Comment
