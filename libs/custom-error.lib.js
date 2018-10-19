'use strict';

class CustomError extends Error {
	constructor({message: msg, code = 500}) {
		super(msg);
		this.name = this.constructor.name;
		this.msg = msg;
		this.code = code;
	}
}

module.exports = CustomError;