const userService = require('../services/user.service');
const emailService = require('../services/email.service');
const errorHandler = require('../services/error-handler.service');
const sendJson = require('../services/response.service');
const jwtService = require('../services/jwt.service');
const fetch = require('node-fetch');
const fs = require('fs');

module.exports = {
    signUp: async(req, res) => {
        try {
            const avatarPath = req.imagePath;
            const data = Object.assign({}, req.body);
            await userService.createUser(data, avatarPath);
            return sendJson({
                res,
                msg: 'User registred succesfully'
            })
        } catch(err) {
            errorHandler(err, req, res);
        }
    },

    signIn: async(req, res) => {
        try {
            const email = req.body.email;
            const password = req.body.password;
            const user = await userService.getUserByEmail(email);
            const isValid = await user.verifyPassword(password);
            const token = await jwtService.signLocalToken({email: user.email, _id: user._id});
            return sendJson({
                res,
                data: {
                    localToken: token
                },
                msg: 'User logged in'
            })
        } catch(err) {
            errorHandler(err, req, res);
        }
    },

    sendEmails: async(req, res) => {
        try {
            const email = req.body.email;
            const emailList = req.body.emailsList;
            const subject = 'Github test';
            const html = `Hi, User`
            await emailService.composeEmails({
                to: emailList,
                subject,
                html
            })
            return sendJson({
                res,
                msg: 'Email send'
            });
        } catch(err) {
            errorHandler(err, req, res);
        }
    },

    saveAvatar: async(req, res) => {
        try {
            const filename = req.file.filename;
            const avatarPath = req.file.path;
            const id = req.decoded._id
            await userService.uploadAvatar(id, avatarPath);
            const read = fs.createReadStream(avatarPath);
            read.pipe(res);
        } catch(err) {
            errorHandler(err, req, res);
        }
    },

    saveImage: async(req, res, next) => {
        try {
            const avatarPath = req.file.path;
            req.imagePath = avatarPath;
            return next();
        } catch(err) {
            errorHandler(err, req, res);
        }
    },

    getAvatar: async(req, res) => {
        try {
            const id = req.decoded._id;
            const avatarPath = await userService.retrieveImage(id);
            const read = fs.createReadStream(avatarPath);
            return read.pipe(res);
        } catch(err) {
            errorHandler(err, req, res);
        }
    },

    emailsList: async(req, res) => {
        try {
            const arrayOfEmails = [];
            const locationsList = [];
            let locationsUrl = [];
            const weatherList = [];
            let promises = [];
            if (!req.body.usernames) {
                return sendJson({
                    res,
                    msg: 'Type usernames',
                    success: false,
                    code: 404
                })
            }
            const emailsList = req.body.usernames.split(',');
            const urlsList = emailsList.map((element) => {
                return `https://api.github.com/users/${element}?client_id=${process.env.GIT_ID}&client_secret=${process.env.GIT_SECRET}`;
            })
            const subject = 'Test message'
            const html = `Hi, from Alex`

            const grabContent = url => fetch(url)
            .then(res => res.json())
            .then(res => {
                arrayOfEmails.push(res.email);
                return res;
            })
            .then((res) => {
               locationsList.push(res.location);
            })
            .then((res) => {
                locationsUrl = locationsList.map((element) => {
                    return `http://api.apixu.com/v1/current.json?key=d5f7d1b9f90d41418b973026181910&q=${element}`;
                })
            })

            const getWeather = url => fetch(url)
            .then(res => res.json())
            .then((res) => {
                weatherList.push(res.current.temp_c);
            })

            Promise
                .all(urlsList.map(grabContent))
                .then(() => console.log('URLS were grabbed', arrayOfEmails))
                .then((res) => {
                    Promise.all(locationsUrl.map(getWeather))
                    .then((res) => {
                        for (let i = 0; i < emailsList.length; i++) {
                            promises.push(new Promise((resolve, reject) => {
                                emailService.composeEmails({
                                    to: arrayOfEmails[i],
                                    subject,
                                    html: `Your weather is: ${weatherList[i]}`
                                })
                            }))
                        }
                    })
                })
                .then(() => {
                    Promise
                    .all(promises)
                    .then((response) => {
                        return sendJson({
                            res,
                            msg: 'Emails were sent'
                        })
                    })
                })
        } catch(err) {
            console.log(err)
            errorHandler(err, req, res);
        }
    }
}