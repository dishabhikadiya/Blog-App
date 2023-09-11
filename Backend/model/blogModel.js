const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema(
  {
    images: {
      type: String,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
