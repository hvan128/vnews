import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  rewriteTitle: { type: String }, // tiêu đề đã rewrite
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  rewritten: { type: String }, // nội dung đã rewrite
  htmlContent: { type: String }, // HTML gốc
  thumbnail: { type: String },
  images: [{ type: String }],
  description: { type: String },
  author: { type: String },
  publishedAt: { type: Date },
  source: { type: String },
  mainCategory: String,
  subCategory: String,
  tags: [{ type: String }],
  readTime: { type: Number },
  originalUrl: { type: String }, // link bài gốc
  published: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  facebookPosted: { type: Boolean, default: false },
  facebookPostId: { type: String, default: '' },
  facebookPostTime: { type: Date },
});

export default mongoose.models.Post || mongoose.model("Post", PostSchema);

export type PostType = {
  _id: string;
  title: string;
  rewriteTitle: string; // tiêu đề đã rewrite
  slug: string;
  content: string;
  rewritten: string;
  htmlContent: string;
  thumbnail: string;
  images: string[];
  description: string;
  author: string;
  publishedAt: Date;
  source: string;
  mainCategory: string;
  subCategory: string;
  tags: string[];
  readTime: number;
  originalUrl: string;
  published: boolean;
  createdAt: Date;
  facebookPosted: boolean;
  facebookPostId: string;
  facebookPostTime: Date;
};
