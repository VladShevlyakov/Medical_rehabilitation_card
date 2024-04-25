import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
    res.json({ message: "API is working!" });
};

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(
            errorHandler(403, "Вам не разрешено обновлять этого пользователя")
        );
    }
    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(
                errorHandler(400, "Пароль должен содержать не менее 6 символов")
            );
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    if (req.body.username) {
        if (req.body.username.length < 7 || req.body.username.length > 20) {
            return next(
                errorHandler(
                    400,
                    "Имя пользователя должно содержать от 7 до 20 символов"
                )
            );
        }
        if (req.body.username.includes(" ")) {
            return next(
                errorHandler(
                    400,
                    "Имя пользователя не должно содержать пробелов"
                )
            );
        }
        if (req.body.username !== req.body.username.toLowerCase()) {
            return next(
                errorHandler(
                    400,
                    "Имя пользователя должно быть маленькими буквами"
                )
            );
        }
        if (!req.body.username.match(/^[a-zа-я0-9]+$/u)) {
            return next(
                errorHandler(
                    400,
                    "Имя пользователя может состоять только из букв и цифр"
                )
            );
        }
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    profileImg: req.body.profileImg,
                    password: req.body.password,
                },
            },
            { new: true }
        );
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};
