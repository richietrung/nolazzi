/* eslint-disable import/no-extraneous-dependencies */
const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.name = user.accountName;
        this.url = url;
    }

    newTransport() {
        let transport;
        if (process.env.NODE_ENV !== 'development') {
            transport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.GMAIL_USERNAME,
                    pass: process.env.GMAIL_PASSWORD,
                },
            });
            return transport;
        }
        transport = nodemailer.createTransport({
            host: 'sandbox.smtp.mailtrap.io',
            port: 25,
            auth: {
                user: '61eb5e04d9ce3e',
                pass: '8a8f63db9fd700',
            },
        });
        return transport;
    }

    async send(subject, template) {
        const html = pug.renderFile(
            `${__dirname}/../views/mail/${template}.pug`,
            {
                subject: subject,
                url: this.url,
            }
        );
        const mailOptions = {
            from: 'Richie Trung <trungvocungdeptrai@gmail.com>',
            to: this.to,
            subject,
            html: html,
            text: htmlToText.htmlToText(html),
        };
        await this.newTransport().sendMail(mailOptions);
    }

    async sendResetPassword() {
        await this.send(
            'Reset Password (Valid for 10 minutes!)',
            'resetpassword'
        );
    }
};
