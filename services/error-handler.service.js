'use strict';
const sendJson = require('../services/response.service');

module.exports = (err, req, res) => {
	switch(err.msg) {
		case 'not registered':
		case 'invalid password':
			res.status(401);
			sendJson({res, msg: 'wrong username or password',  success: false, code: 401});
			break;
		case 'no password':
			res.status(400);
			sendJson({res, msg: err.msg, redirect: '/api/user/login', success: false, code: 400});
			break;
		case 'no key':
			res.status(err.code);
			sendJson({
				res,
				msg: 'tried to enter GA code without a TOTP setup',
				redirect: '/api/totp/setup',
				code: err.code,
				success: false
			});
			break;
		default:
			res.status(err.code || 400);
			sendJson({res, msg: err.msg || 'Server error', success: false, code: err.code || 400});
			break;
	}
};