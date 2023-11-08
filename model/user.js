const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema (
    {

        email: {
            type: String,
            unique: true,
            required: [true,'Please add an email'],
        },
        password: {
            type: String,
            unique: false,
            required: [true,'add ur password'],
        },
        ingredients: {
            // type : [IgredientSchema]
            type: [String],
            

        },

    },

{collection:'users'}
)

const User = mongoose.model('User',userSchema)

module.exports =  User

