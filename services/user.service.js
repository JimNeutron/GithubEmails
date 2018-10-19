'use strict';

const User = require('../models/user.model').UserModel;
const CustomError = require('../libs/custom-error.lib');

module.exports = {
    createUser: async(data, avatar) => {
        try {
            const user = await User.findOne({email: data.email});
            if (user) {
                throw new CustomError({
                    message: 'User with this email already exists',
                    code: 409
                })
            }
            const hash = await User.createHash(data.password);
            const fields = {
                email: data.email,
                password: hash,
                avatar: avatar,
                avatar_url: data.avatar_url
            }
            await User.create(fields);
            return;
        } catch(err) {
            throw new CustomError({
                message: err.message,
                code: err.code
            })
        }
    },

    getUserByEmail: async(email) => {
        try {
            const user = await User.findOne({email: email});
            if (!user) {
                throw new CustomError({
                    message: 'No user with this email',
                    code: 404
                })
            }
            return user;
        } catch(err) {
			throw new CustomError({
				message: err.message,
				code: err.code
			});
        }
    },

    uploadAvatar: async(id, path) => {
        try {
            const user = await User.findOne({_id: id});
            if (!user) {
				throw new CustomError({
					message: 'no user by this _id',
					code: 404
				});
            }
            user.avatar = path;
            return user.save();
        } catch(err) {
            throw new CustomError({
				message: err.message,
				code: err.code
			});
        }
    },

    uploadImage: async(email, path) => {
        try {
            const user = await User.findOne({email: email});
            if (!user) {
				throw new CustomError({
					message: 'no user by this email',
					code: 404
				});
            }
            user.avatar = path;
            return user.save();
        } catch(err) {
            throw new CustomError({
				message: err.message,
				code: err.code
			});
        }
    },

    retrieveImage: async(id) => {
        try {
            const user = await User.findOne({_id: id});
            if (!user) {
                throw new CustomError({
					message: 'no user by this email',
					code: 404
				});
            }
            return user.avatar;
        } catch(err) {
            throw new CustomError({
				message: err.message,
				code: err.code || 500
			});
        }
    }
}