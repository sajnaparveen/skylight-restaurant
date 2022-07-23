const mongoose = require('mongoose')
const crypto = require('crypto')

const TableSchema = new mongoose.Schema({
    uuid: { type: String, required: false },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    bookingDate: {
        type: String,
        required: true
    },
    bookingTime: {
        type: String,
        required: true
    },
    peopleCount: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }

})

TableSchema.pre('save', function (next) {
    this.uuid = 'Table-' + crypto.pseudoRandomBytes(5).toString('hex').toUpperCase()
    console.log(this.uuid)
    next()
})

module.exports = mongoose.model('Table', TableSchema, 'Table')

