import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minLength: 1,
        maxLength: 20,
        required: [true, 'User name is required']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: 8
    }
},{timestamps: true});

const User = new mongoose.model('User', userSchema);

export default User;