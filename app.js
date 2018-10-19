require('dotenv').config();

const express = require('express');
const app = express();
const Config = require('./libs/config.lib');
const env = process.env.NODE_ENV;
const path = require('path');
const appConfig = require( new Config(env, path.resolve('config')).getConfig('app')).app;
const port = process.env.PORT;
const apiRouter = require('./routes/api.route');

const db = require('./libs/db.lib');

const bodyParser = require('body-parser');


db()
.then(() => {
    console.log(`Succesfully connected to db`);
    app.disable('x-powered-by');
    app.use(bodyParser.urlencoded({
		extended: false,
		limit: '20mb',
		parameterLimit: 100000
	}));

	app.use(bodyParser.json({
		limit: '20mb',
		parameterLimit: 100000
	}));

	app.use(bodyParser.raw({
		limit: '20mb',
		inflate: true,
		parameterLimit: 100000
    }));

    app.use('/api', apiRouter)
    
    app.use((req, res, next) => {
		const err = new Error('Not found');
		err.status = 404;
		next(err);
    });
    
    const errorHandler = (err, req, res) => {
		console.log(err.stack);
		res.send(err);
	};

    app.use(errorHandler);
    
    app.listen(port, () => {
        console.log(`Server ith listening on port: ${port}`);
    })
})