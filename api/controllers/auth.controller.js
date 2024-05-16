import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// Проверка существования пользователя по снилсу
const checkExistingSnils = async (snils) => {
    const existingUser = await User.findOne({ snils });
    return existingUser;
};

// Проверка существования пользователя по почте
const checkExistingEmail = async (email) => {
    const existingUser = await User.findOne({ email });
    return existingUser;
};

export const signup = async (req, res, next) => {
    const { snils, email, password } = req.body;

    if (
        !snils ||
        !email ||
        !password ||
        snils === "" ||
        email === "" ||
        password === ""
    ) {
        next(errorHandler(400, "Все поля должны быть заполнены"));
    }

    // Проверка существования пользователя с указанным снилсом
    const existingSnilsUser = await checkExistingSnils(snils);
    if (existingSnilsUser) {
        return next(
            errorHandler(400, "Пользователь с таким СНИЛС уже существует")
        );
    }

    // Проверка существования пользователя с указанной почтой
    const existingEmailUser = await checkExistingEmail(email);
    if (existingEmailUser) {
        return next(
            errorHandler(400, "Пользователь с такой почтой уже существует")
        );
    }

    if (snils) {
        if (req.body.snils.length !== 16) {
            return next(
                errorHandler(
                    400,
                    "СНИЛС пользователя должен содержать ровно 16 символов"
                )
            );
        }
        if (req.body.snils[0] === "0") {
            return next(
                errorHandler(400, "СНИЛС пользователя не должен начинаться с 0")
            );
        }
        if (req.body.snils.includes(" ")) {
            return next(
                errorHandler(
                    400,
                    "СНИЛС пользователя не должен содержать пробелов"
                )
            );
        }
        if (!req.body.snils.match(/^\d+$/)) {
            return next(
                errorHandler(
                    400,
                    "СНИЛС пользователя может состоять только из цифр"
                )
            );
        }
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
        snils,
        email,
        password: hashedPassword,
    });

    try {
        await newUser.save();
        res.json("Регистрация успешна");
    } catch (error) {
        next(error);
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password || email === "" || password === "") {
        next(errorHandler(400, "Все поля должны быть заполнены"));
    }

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, "Аккаунт не найден"));
        }
        const validPassword = bcryptjs.compareSync(
            password,
            validUser.password
        );
        if (!validPassword) {
            return next(errorHandler(400, "Неверный пароль"));
        }

        const token = jwt.sign(
            { id: validUser._id, isDoctor: validUser.isDoctor },
            process.env.JWT_SECRET
        );

        const { password: pass, ...rest } = validUser._doc;

        res.status(200)
            .cookie("access_token", token, {
                httpOnly: true,
            })
            .json(rest);
    } catch (error) {
        next(error);
    }
};

export const google = async (req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const token = jwt.sign(
                { id: user._id, isDoctor: user.isDoctor },
                process.env.JWT_SECRET
            );
            const { password, ...rest } = user._doc;
            res.status(200)
                .cookie("access_token", token, {
                    httpOnly: true,
                })
                .json(rest);
        } else {
            const generatedPassword =
                Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                //Vlad Shevlyakov => vladshevlyakov1210
                username:
                    name.toLowerCase().split(" ").join("") +
                    Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profileImg: googlePhotoUrl,
            });
            await newUser.save();
            const token = jwt.sign(
                { id: newUser._id, isDoctor: newUser.isDoctor },
                process.env.JWT_SECRET
            );
            const { password, ...rest } = newUser._doc;
            res.status(200)
                .cookie("access_token", token, {
                    httpOnly: true,
                })
                .json(rest);
        }
    } catch (error) {
        next(error);
    }
};
