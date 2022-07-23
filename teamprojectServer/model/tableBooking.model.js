const mongoose = require('mongoose');
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
    uuid: { type: String, required: false },
    date: { type: String, required: false },
    location: { type: String, required: false },
    time: { type: String, required: false },
    person: { type: String, required: false },
    table: { type: String, required: false },
    userDetails: { type: Object, required: false }

}, {
    timestamps: true
})

userSchema.pre('save', function (next) {
    this.uuid = 'TABLE-' + crypto.pseudoRandomBytes(4).toString('hex').toLocaleUpperCase()
    next();
})
module.exports = mongoose.model('tablebook', userSchema, 'tablebook');

