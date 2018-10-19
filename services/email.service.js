require('dotenv').config();

const CustomError = require('../libs/custom-error.lib');
const nodemailer = require('nodemailer');
const Config = require('../libs/config.lib');
const smtpTransport = require('nodemailer-smtp-transport');
const emailCreds = require(new Config(process.env.NODE_ENV, require('path').resolve('config')).getConfig('app')).emailCreds;

const transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    }
}))

const sendEmail = require('bluebird').promisify(transporter.sendMail, {context: transporter});

module.exports = {
    composeEmails: async({from = 'alex', to, subject = 'Hi from me', html}) => {
        try {
            return await sendEmail({from, to, subject, html});
        } catch(err) {
            console.log(err);
            throw new CustomError({
                message: 'error while sneding emails',
                code: 400
            })
        }   
    }
}