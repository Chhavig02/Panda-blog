import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  authorId: string;
  authorName?: string;
  tags: string[];
  views: number;
  likes: number;
  likedBy: string[];
  shares: number;
  sharedBy: string[];
  rankingScore: number;
  featuredImage?: string;
  isPremium: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
    },
    authorId: {
      type: String,
      required: true,
      index: true,
    },
    authorName: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: {
      type: [String],
      default: [],
    },
    shares: {
      type: Number,
      default: 0,
    },
    sharedBy: {
      type: [String],
      default: [],
    },
    rankingScore: {
      type: Number,
      default: 0,
    },
    featuredImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1488998427799-e3362cec87c3?w=800&h=400&fit=crop',
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate ranking score before saving
PostSchema.pre('save', function (next) {
  // Ranking formula: (views * 0.3) + (likes * 2) + (shares * 1.5)
  this.rankingScore = this.views * 0.3 + this.likes * 2 + (this.shares || 0) * 1.5;
  next();
});

// Index for ranking
PostSchema.index({ rankingScore: -1 });
PostSchema.index({ createdAt: -1 });

export default mongoose.model<IPost>('Post', PostSchema);

