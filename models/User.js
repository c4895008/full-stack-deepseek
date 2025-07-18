import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    clerkUserId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String,
        required: false,
    }
}, {
    timestamps: true,
}
)
const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;