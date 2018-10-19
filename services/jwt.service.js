const jwt = require('jsonwebtoken');    
const CustomError = require('../libs/custom-error.lib');

module.exports = {
    signLocalToken: async(payload) => {
        try {
            const token = await jwt.sign(payload, process.env.JWT_SECRET || 'secret', {expiresIn: '1h'});
            return token
        } catch(err) {
            throw new CustomError({
                message: 'Error dutring token signing',
                code: 400
            })
        }
    },

    verifyLocalToken: async(token) => {
        try {
            const decoded = await jwt.verify(token, process.env.JWT_SECRET || 'secret');
            return decoded;
        } catch(err) {
            throw new CustomError({
                message: 'error during local token verification',
                code: 401
            })
        }
    },

    verifySignUpToken: async(token) => {
        try {
            const decoded = await jwt.verify(token, process.env.JWT_SECRET_SIGN_UP || 'secret2');
            return decoded;
        } catch(err) {
            throw new CustomError({
                message: 'error during signup token verification',
                code: 401
            })
        }
    }
}