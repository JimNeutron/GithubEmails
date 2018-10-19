'use strict';

const mongoose = require('mongoose');
const envName = process.env.NODE_ENV;
const Config = require('../libs/config.lib');
const dbConfig = require(new Config(envName, require('path').resolve('config')).getConfig('app')).storage;


module.exports = (url) => {
	if(!url) {
		url = process.env.MONGOLAB_CYAN_URI || dbConfig.db_url;
	}

	return mongoose.connect(url);
};
