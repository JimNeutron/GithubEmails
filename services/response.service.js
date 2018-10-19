'use strict';

module.exports = ({data, msg, res, code, success = true}) => {
	const result = {};
	result.data = data;
	result.code = code || 200;
	result.msg = msg;
	result.success = success;
	
	return res.json(result);
};