// sendTempkeyEmail, verifyAccount, resetPassword
// ENV REQUIREMENTS
// EMAIL_DOMAIN = 'gmail'
// EMAIL_SENDER = 'uglesoft@gmail.com'
// EMAIL_TOKEN = 'abcdefghijklmnop'




const nodemailer = require('nodemailer');


const { tempkey } = require(`${__dirname}/hashing-methods.js`)
const { hash } = require(`${__dirname}/hashing-methods.js`)


module.exports = {


    sendTempkeyEmail: async (dtb, args, callback) => {
        // args = {
        //     recipient:user_email,
        //     subject
        //     text:text
        //     html:html
        // }

        await tryCreateTable(dtb);

        return new Promise((resolve) => {
            try {

                if (args === undefined || args === null || typeof args != 'object') {
                    callback({
                        'message': `invalid args | args must be object, received '${args} ${typeof args}'`
                    });
                    resolve();
                } else if (args.recipient === undefined || args.recipient === null || typeof args.recipient != 'string') {
                    callback({
                        'message': `invalid args.recipient | args.recipient must be string, received '${args.recipient} ${typeof args.recipient}'`
                    });
                    resolve();
                } else if (args.subject === undefined || args.subject === null || typeof args.subject != 'string') {
                    callback({
                        'message': `invalid args.subject | args.subject must be string, received '${args.subject} ${typeof args.subject}'`
                    });
                    resolve();
                } else if (args.text === undefined || args.text === null || typeof args.text != 'string') {
                    callback({
                        'message': `invalid args.text | args.text must be string, received '${args.text} ${typeof args.text}'`
                    });
                    resolve();
                } else if (args.html === undefined || args.html === null || typeof args.html != 'string') {
                    callback({
                        'message': `invalid args.html | args.html must be string, received '${args.html} ${typeof args.html}'`
                    });
                    resolve();


                } else {

                    dtb.run('UPDATE auth SET tempkey = ? WHERE email = ?;', [
                        tempkey(),
                        args.recipient,
                    ], function (err) {
                        if (err) {
                            callback(err);
                            resolve();
                        } else if (this.changes == 0) {
                            callback(
                                {
                                    'message': `Credentials failed for ${args.recipient} | Row(s) affected: ${this.changes}`
                                }
                            );
                            resolve();
                        } else {
                            dtb.all('SELECT tempkey FROM auth WHERE email = ?;', [
                                args.recipient,
                            ], (err, data) => {
                                if (err) {
                                    callback(err);
                                    resolve();
                                } else {

                                    var transporter = nodemailer.createTransport({
                                        service: process.env.EMAIL_DOMAIN,
                                        auth: {
                                            user: process.env.EMAIL_SENDER,
                                            pass: process.env.EMAIL_TOKEN
                                        }
                                    });

                                    var mailOptions = {
                                        from: process.env.EMAIL_SENDER,
                                        to: args.recipient,
                                        subject: args.subject,

                                        text: args.text.replace('tempkey=', `tempkey=${data[0].tempkey}`),
                                        html: args.html.replace('tempkey=', `tempkey=${data[0].tempkey}`),
                                    };

                                    transporter.sendMail(mailOptions, (err, info) => {
                                        if (err) {
                                            callback(err);
                                            resolve();
                                        } else {
                                            callback(null, info);
                                            resolve();
                                        }
                                    });

                                }
                            });

                        }
                    });
                }
            } catch (err) {
                try {
                    callback(err);
                    resolve();
                } catch (err) {
                    resolve();
                }
            }
        });
    },


    verifyUser: async (dtb, args, callback) => {
        // args = {
        //     email:email,
        //     tempkey:tempkey
        // }

        await tryCreateTable(dtb);

        return new Promise((resolve) => {
            try {

                // input screening
                if (args === undefined) {
                    callback({
                        message: 'args is undefined'
                    });
                    resolve();
                } else if (typeof args != 'object') {
                    callback({
                        message: `args must be object, received "${typeof args}"`
                    });
                    resolve();


                } else if (args.email === undefined) {
                    callback({
                        message: 'args.email is undefined'
                    });
                    resolve();
                } else if (typeof args.email != 'string') {
                    callback({
                        message: `args.email must be string, received "${typeof args.email}"`
                    });
                    resolve();


                } else if (args.tempkey === undefined) {
                    callback({
                        message: 'args.tempkey is undefined'
                    });
                    resolve();
                } else if (typeof args.tempkey != 'string') {
                    callback({
                        message: `args.tempkey must be string, received "${typeof args.tempkey}"`
                    });
                    resolve();


                } else {

                    dtb.run('UPDATE auth SET status = "verified", tempkey = NULL WHERE email = ? AND tempkey = ?;', [
                        args.email,
                        args.tempkey
                    ], async function (err) {
                        if (err) {

                            callback(err);
                            resolve();
                        } else if (this.changes == 0) {

                            callback(
                                {
                                    'message': `Credentials failed | Row(s) affected: ${this.changes}`
                                }
                            );
                            resolve();
                        } else {

                            callback(null);
                            resolve();
                        }
                    });

                }
            } catch (err) {
                try {
                    callback(err);
                    resolve();
                } catch (err) {
                    resolve();
                }
            }
        });
    },


    resetPassword: async (dtb, args, callback) => {
        // args = {
        //     email:email,
        //     password:password,
        //     tempkey:tempkey,
        // }

        // await tryCreateTable(dtb);

        return new Promise((resolve) => {
            try {

                if (args === undefined || args === null || typeof args != 'object') {
                    callback({
                        'message': `invalid args | args must be object, received '${args} ${typeof args}'`
                    });
                    resolve();
                } else if (args.email === undefined || args.email === null || typeof args.email != 'string') {
                    callback({
                        'message': `invalid args.email | args.email must be string, received '${args.email} ${typeof args.email}'`
                    });
                    resolve();
                } else if (args.password === undefined || args.password === null || typeof args.password != 'string') {
                    callback({
                        'message': `invalid args.password | args.password must be string, received '${args.password} ${typeof args.password}'`
                    });
                    resolve();
                } else if (args.tempkey === undefined || args.tempkey === null || typeof args.tempkey != 'string') {
                    callback({
                        'message': `invalid args.tempkey | args.tempkey must be string, received '${args.tempkey} ${typeof args.tempkey}'`
                    });
                    resolve();
                } else if (args.html === undefined || args.html === null || typeof args.html != 'string') {
                    callback({
                        'message': `invalid args.html | args.html must be string, received '${args.html} ${typeof args.html}'`
                    });
                    resolve();

                } else {

                    dtb.run('UPDATE auth SET hash = ?, tempkey = NULL WHERE email = ? AND tempkey = ?;', [
                        hash(args.password),
                        args.email,
                        args.tempkey
                    ], async function (err) {
                        if (err) {
                            callback(err);
                            resolve();
                        } else if (this.changes == 0) {
                            callback(
                                {
                                    'message': `Credentials failed | Row(s) affected: ${this.changes}`
                                }
                            );
                            resolve();
                        } else {
                            callback(null);
                            resolve();
                        }
                    });

                }
            } catch (err) {
                try {
                    callback(err);
                    resolve();
                } catch (err) {
                    resolve();
                }
            }
        });
    },


}