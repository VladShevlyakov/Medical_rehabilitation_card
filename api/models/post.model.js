// post.model.js
import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
            unique: true,
        },
        image: {
            type: String,
        },
        category: {
            type: String,
            default: "uncategorized",
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
