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
    if (req.body.snils) {
        if (req.body.snils.length !== 16) {
            return next(
                errorHandler(
                    400,
                    "Полис пользователя должен содержать ровно 16 символов"
                )
            );
        }
        if (req.body.snils[0] === "0") {
            return next(
                errorHandler(400, "Полис пользователя не должен начинаться с 0")
            );
        }
        if (req.body.snils.includes(" ")) {
            return next(
                errorHandler(
                    400,
                    "Полис пользователя не должен содержать пробелов"
                )
            );
        }
        if (!req.body.snils.match(/^\d+$/)) {
            return next(
                errorHandler(
                    400,
                    "Полис пользователя может состоять только из цифр"
                )
            );
        }
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            {
                $set: {
                    snils: req.body.snils,
                    surname: req.body.surname,
                    fullname: req.body.fullname,
                    patronymic: req.body.patronymic,
                    dateOfBirth: req.body.dateOfBirth,
                    disabilityGroup: req.body.disabilityGroup,
                    registAddress: req.body.registAddress,
                    gender: req.body.gender,
                    place: req.body.place,
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

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(
            errorHandler(403, "Вам не разрешено удалять этого пользователя")
        );
    }
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json("Пользователь удален");
    } catch (error) {
        next(error);
    }
};

export const signout = (req, res, next) => {
    try {
        res.clearCookie("access_token")
            .status(200)
            .json("Пользователь вышел из системы");
    } catch (error) {
        next(error);
    }
};
