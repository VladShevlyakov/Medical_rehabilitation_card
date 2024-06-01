import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        polis: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        profileImg: {
            type: String,
            default:
                "https://static.tildacdn.com/tild3133-6461-4762-b763-393238646435/1_9e9CY6nDatrFlVkDHW.png",
        },
        fullname: {
            type: String,
        },
        surname: {
            type: String,
        },
        patronymic: {
            type: String,
        },
        dateOfBirth: {
            type: Date,
        },
        disabilityGroup: {
            type: String,
        },
        registAddress: {
            type: Object,
        },
        gender: {
            type: String,
        },
        place: {
            type: String,
        },
        isDoctor: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
