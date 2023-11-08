const express = require('express')

const {
    checkAuthPayload , 
    checkEmailPayload , 
    checkPasswordPayload,
    signupResponse,
} = require('../controllers/admin-controllers')

exports.router = (() => {
    const router = express.Router()

    router
    .route('/signup/')
    .post(
        checkAuthPayload,
        checkEmailPayload,
        checkPasswordPayload,
        signupResponse
    )
    return router
})()