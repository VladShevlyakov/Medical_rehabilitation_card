import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

const formatPostData = (procedures, userId, author) => {
    return procedures.map((procedure) => {
        const slug = procedure.title
            .split(" ")
            .join("-")
            .toLowerCase()
            .replace(/[^\wа-яёЁa-zA-Z0-9-]/g, "");
        return {
            ...procedure,
            slug,
            userId: userId,
            author: author,
        };
    });
};

export const create = async (req, res, next) => {
    if (!req.user.isDoctor) {
        return next(errorHandler(403, "Вам не разрешено создавать запись"));
    }

    try {
        const { userId, author, place, startDate, endDate, procedures } =
            req.body;
        const formattedProcedures = formatPostData(procedures, userId, author);

        const newPost = new Post({
            userId,
            author,
            place,
            startDate,
            endDate,
            procedures: formattedProcedures,
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        next(error);
    }
};

export const getPosts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === "asc" ? 1 : -1;

        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.postId && { _id: req.query.postId }),
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

export const deletePost = async (req, res, next) => {
    if (!req.user.isDoctor) {
        return next(errorHandler(403, "Вы не можете удалить этот пост"));
    }

    const post = await Post.findOne({
        _id: req.params.postId,
        userId: req.params.userId,
    });
    if (!post) {
        return next(
            errorHandler(
                404,
                "Запись не найдена или у вас нет прав на ее удаление"
            )
        );
    }

    try {
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json("Пост удален");
    } catch (error) {
        next(error);
    }
};
