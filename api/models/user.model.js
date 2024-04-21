import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
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
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
