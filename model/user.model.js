const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    {isEmail} = require('validator');



const userScheme = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 32
    }, 
    surname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 32
    },
    email: {
        type: String,
        required: true,
        minlength: 8,
        validate: [isEmail, 'Please enter a valid email address']
    },
    date: {
        type: Date,
        default: Date.now       // Для mongoDb - 
    }
})

const User = mongoose.model('User', userScheme)

module.exports = User;