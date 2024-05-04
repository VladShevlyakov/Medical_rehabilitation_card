import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
    if (!req.user.isDoctor) {
        return next(errorHandler(403, "Вам не разрешено создавать запись"));
    }
    if (!req.body.title || !req.body.content) {
        return next(
            errorHandler(400, "Пожалуйста, заполните все обязательные поля")
        );
    }
    const slug = req.body.title
        .split(" ")
        .join("-")
        .toLowerCase()
        .replace(/[^\wа-яёЁa-zA-Z0-9-]/g, "");
    const newPost = new Post({
        ...req.body,
        slug,
        userId: req.user.id,
    });

    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        next(error);
    }
};
