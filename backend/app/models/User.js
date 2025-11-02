const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 50,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 50,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    phoneNumber: {
        type: String,
        required: true,
        maxlength: 20,
    },
    address: {
        type: String,
        maxlength: 200,
    },
    admin: {
        type: Boolean,
        default: false,
    },
    superadmin: {
        type: Boolean,
        default: false,
    },
    avatar: {
        type: String,
        default: "https://jbagy.me/wp-content/uploads/2025/03/Hinh-anh-avatar-doremon-chibi-1.jpg"
    },
    active: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
