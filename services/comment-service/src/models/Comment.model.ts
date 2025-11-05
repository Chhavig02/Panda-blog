import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  postId: string;
  commenterId: string;
  commenterName?: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    postId: {
      type: String,
      required: true,
      index: true,
    },
    commenterId: {
      type: String,
      required: true,
      index: true,
    },
    commenterName: {
      type: String,
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IComment>('Comment', CommentSchema);

