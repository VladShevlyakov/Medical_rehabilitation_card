// post.model.js
import mongoose from "mongoose";

const procedureSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String },
    image: { type: String },
    slug: { type: String, required: true },
});

const postSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        place: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        procedures: [procedureSchema],
        author: {
            fullname: { type: String, required: true },
            surname: { type: String, required: true },
        },
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
