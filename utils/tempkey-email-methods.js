// sendTempkeyEmail, verifyAccount, resetPassword




const { tempkey } = require(`${__dirname}/hashing-methods.js`)
const { hash } = require(`${__dirname}/hashing-methods.js`)


module.exports = {


    sendTempkeyEmail: async (dtb, args, callback) => {
        // args = {
        //     recipient:user_email,
        //     sender:business_email
        //     domain:gmail
        //     token:business_email_token,
        //     text:text
        //     html:html
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


                } else if (args.recipient === undefined) {
                    callback({
                        message: 'args.recipient is undefined'
                    });
                    resolve();
                } else if (typeof args.recipient != 'string') {
                    callback({
                        message: `args.recipient must be string, received "${typeof args.recipient}"`
                    });
                    resolve();


                } else if (args.sender === undefined) {
                    callback({
                        message: 'args.sender is undefined'
                    });
                    resolve();
                } else if (typeof args.sender != 'string') {
                    callback({
                        message: `args.sender must be string, received "${typeof args.sender}"`
                    });
                    resolve();


                } else if (args.domain === undefined) {
                    callback({
                        message: 'args.domain is undefined'
                    });
                    resolve();
                } else if (typeof args.domain != 'string') {
                    callback({
                        message: `args.domain must be string, received "${typeof args.domain}"`
                    });
                    resolve();


                } else if (args.token === undefined) {
                    callback({
                        message: 'args.token is undefined'
                    });
                    resolve();
                } else if (typeof args.token != 'string') {
                    callback({
                        message: `args.token must be string, received "${typeof args.token}"`
                    });
                    resolve();


                } else if (args.text === undefined) {
                    callback({
                        message: 'args.text is undefined'
                    });
                    resolve();
                } else if (typeof args.text != 'string') {
                    callback({
                        message: `args.text must be string, received "${typeof args.text}"`
                    });
                    resolve();


                } else if (args.html === undefined) {
                    callback({
                        message: 'args.html is undefined'
                    });
                    resolve();
                } else if (typeof args.html != 'string') {
                    callback({
                        message: `args.html must be string, received "${typeof args.html}"`
                    });
                    resolve();


                } else {

                    dtb.run('UPDATE auth SET tempkey = ? WHERE email = ?;', [
                        tempkey(),
                        args.recipient,
                    ], async function (err) {
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
                            ], async function (err, data) {
                                if (err) {

                                    callback(err);
                                    resolve();
                                } else {

                                    var transporter = nodemailer.createTransport({
                                        service: args.domain,
                                        auth: {
                                            user: args.sender,
                                            pass: args.token
                                        }
                                    });

                                    var mailOptions = {
                                        from: args.sender,
                                        to: args.recipient,
                                        subject: 'Please verify your Account',

                                        text: args.text.replace('tempkey=', `tempkey=${data[0].tempkey}`),
                                        html: args.html.replace('tempkey=', `tempkey=${data[0].tempkey}`),
                                    };

                                    transporter.sendMail(mailOptions, function (err, info) {
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


    changePassword: async (dtb, args, callback) => {
        // args = {
        //     email:email,
        //     tempkey:tempkey,
        //     password:password,
        //     salt:salt
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


                } else if (args.password === undefined) {
                    callback({
                        message: 'args.password is undefined'
                    });
                    resolve();
                } else if (typeof args.password != 'string') {
                    callback({
                        message: `args.password must be string, received "${typeof args.password}"`
                    });
                    resolve();


                } else if (args.salt === undefined) {
                    callback({
                        message: 'args.salt is undefined'
                    });
                    resolve();
                } else if (typeof args.salt != 'string') {
                    callback({
                        message: `args.salt must be string, received "${typeof args.salt}"`
                    });
                    resolve();


                } else {

                    dtb.run('UPDATE auth SET hash = ?, tempkey = NULL WHERE email = ? AND tempkey = ?;', [
                        hash(args.password, args.salt),
                        args.email,
                        args.tempkey
                    ], async function (err) {
                        if (err) {

                            callback(err);
                            resolve();
                        } else if (this.changes == 0) {

                            callback(
                                {
                                    'message': `Credentials failed | Row(s) affected: ${this.changes} | ${args.email} | ${args.tempkey}`
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