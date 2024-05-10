// post.controller.js
import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

const formatPostData = (formDataList, userId) => {
    return formDataList.map((formData) => {
        const slug = formData.title
            .split(" ")
            .join("-")
            .toLowerCase()
            .replace(/[^\wа-яёЁa-zA-Z0-9-]/g, "");
        return {
            ...formData,
            slug,
            userId: userId,
        };
    });
};

export const create = async (req, res, next) => {
    if (!req.user.isDoctor) {
        return next(errorHandler(403, "Вам не разрешено создавать запись"));
    }

    try {
        const userId = req.user.id;
        const postData = formatPostData(req.body, userId);
        const savedPosts = await Post.create(postData);
        res.status(201).json(savedPosts);
    } catch (error) {
        next(error);
    }
};

export const getposts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === "asc" ? 1 : -1;
        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
        })
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        res.status(200).json({
            posts,
        });
    } catch (error) {
        next(error);
    }
};
