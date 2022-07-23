const mongoose = require('mongoose');
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
    uuid: { type: String, required: false },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    userName: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, trim: true, unique: true },
    mobileNumber: { type: String, required: true },
    address: { type: String, required: false },
    role: { type: String, enum: ['admin', 'user'], required: true, default: "user" },
    verifyed: { type: Boolean, required: false, default: false },
    lastedVisited: {type: String, required: false},
    loginStatus:{type: Boolean, required: false, default: false},
    firstLoginStatus:{type: Boolean, required: false, default: false},
    logintype: { type: String, enum: ['google', 'facebook','default'], required: true, default: "default" },

}, {
    timestamps: true
})

userSchema.pre('save', function (next) {
    this.uuid = 'USER-' + crypto.pseudoRandomBytes(4).toString('hex').toLocaleUpperCase()
    next();
})
module.exports = mongoose.model('user', userSchema, 'user');

