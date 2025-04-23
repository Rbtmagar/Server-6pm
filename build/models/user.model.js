import { Schema, model } from 'mongoose';
const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'User is already exists with provided email'],
    },
    fullName: {
        type: String,
        required: [true, 'Name is required'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    user_name: {
        type: String,
        required: [true, 'Username is required'],
    }
}, { timestamps: true });
const User = model('user', userSchema);
export default User;
