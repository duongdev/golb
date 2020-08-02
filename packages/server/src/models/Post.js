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
  },
  { timestamps: true },
)

postSchema.plugin(mongooseSlugPlugin, { tmpl: '<%=title%>' })

export const Post = mongoose.model('Post', postSchema)
export default Post
