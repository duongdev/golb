import mongoose, { Schema } from 'mongoose'
import mongooseSlugPlugin from 'mongoose-slug-plugin'

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: Schema.Types.Mixed,
      required: true,
    },
    plainText: {
      type: String,
      default: '',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: 'User',
    },
  },
  { timestamps: true, toJSON: { getters: true, virtuals: true } },
)

postSchema.plugin(mongooseSlugPlugin, { tmpl: '<%=title%>' })
postSchema.index(
  { title: 'text', plainText: 'text' },
  {
    name: 'post_text_index',
    weights: {
      title: 10,
      plainText: 6,
    },
  },
)

export const Post = mongoose.model('Post', postSchema)
export default Post
