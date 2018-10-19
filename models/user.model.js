'use stict';

const mongoose = require('mongoose');
const passwordService = require('../services/password.service');

function createUserSchema(fieldsToAdd) {
	const fields = {
		email: {
			type: String,
			unique: true,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		avatar: {
			type: String
		},
		avatar_url: {
			type: String
		}
	};
	
	const schema = mongoose.Schema(fields);
	if(fieldsToAdd) {
		schema.add(fieldsToAdd);
	}
	return schema;
}


const UserSchema = createUserSchema();

UserSchema.statics.createHash = passwordService.createHash;

UserSchema.methods.verifyPassword = passwordService.verifyPassword;

const UserModel = mongoose.model('User', UserSchema);

module.exports = {UserModel, createUserSchema};