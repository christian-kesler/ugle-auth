const { hash } = require(`${__dirname}/hashing.js`)
const { tempkey } = require(`${__dirname}/hashing.js`)


module.exports = {


    /* BEGIN CONFIG METHODS */
    connectToDatabase: (path, callback) => {
        return new Promise((resolve) => {
            try {

                const dtb = new sqlite3.Database(path, sqlite3.OPEN_READWRITE, (err) => {
                    if (err) {
                        callback(err);
                        resolve();
                    } else {
                        global.default_perms = {
                            'admin': false,
                            'user': true
                        }
                        global.lockout_policy = 4
                        global.login_redirect = '/account/home'

                        dtb.exec(
                            `CREATE TABLE IF NOT EXISTS auth(
                            'id' INTEGER PRIMARY KEY AUTOINCREMENT,
                            'email' VARCHAR(255) UNIQUE,
                            
                            'hash' VARCHAR(255),
                            'status' VARCHAR(255),
                            'perms' TEXT,
            
                            'tempkey' VARCHAR(255),
                            'tempkey_datetime' DATETIME,
                            'failed_login_attempts' INTEGER,
            
                            'created_at' DATETIME,
                            'created_by' VARCHAR(255)
                            );`
                        );

                        dtb.exec(
                            `CREATE TABLE IF NOT EXISTS auth_archive(
                            'id' INTEGER,
                            'email' VARCHAR(255),
                                
                            'status' VARCHAR(255),
                            'perms' TEXT,

                            'created_at' DATETIME,
                            'created_by' VARCHAR(255),

                            'archived_at' DATETIME
                            );`
                        );

                        dtb.exec(
                            `CREATE TABLE IF NOT EXISTS auth_log(
                            'id' INTEGER PRIMARY KEY AUTOINCREMENT,

                            'action' VARCHAR(255),
                            'recipient' VARCHAR(255),
                            'data' TEXT,
            
                            'performed_at' DATETIME,
                            'performed_by' VARCHAR(255)
                            );`
                        );

                        callback(null, dtb);
                        resolve();
                    }
                });

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


    defaultPerms: (perms, callback) => {
        return new Promise((resolve) => {
            try {

                global.default_perms = perms
                callback(null)
                resolve()

            } catch (err) {
                try {
                    callback(err);
                    resolve();
                } catch (err) {
                    resolve();
                }
            }

        })
    },


    lockoutPolicy: (attempts, callback) => {
        return new Promise((resolve) => {
            try {

                if (typeof Number(attempts) != 'number') {
                    callback(`arg1 must be number, received ${typeof Number(attempts)} ${attempts}`)
                    resolve()
                } else {
                    global.lockout_policy = Number(attempts)
                    resolve()
                }

            } catch (err) {
                try {
                    callback(err);
                    resolve();
                } catch (err) {
                    resolve();
                }
            }

        })
    },


    loginRedirect: (url, callback) => {
        return new Promise((resolve) => {
            try {

                if (typeof url != 'string') {
                    callback(`arg1 must be string, received ${typeof url} ${url}`)
                    resolve()
                } else {
                    global.login_redirect = url
                    resolve()
                }

            } catch (err) {
                try {
                    callback(err);
                    resolve();
                } catch (err) {
                    resolve();
                }
            }

        })
    },
    /* END CONFIG METHODS */








    /* BEGIN PERMISSION METHODS */
    isLoggedIn: (session, res) => {
        try {

            if (session === undefined || session === null || typeof session != 'object') {
                res.redirect('/auth/login?msg=invalid-session')
                return false
            } else if (res === undefined || res === null || typeof res != 'object') {
                console.error(`arg2 must be response object, received ${typeof res}`)
                return false
            } else {

                if (session.valid != true) {
                    res.redirect('/auth/login?msg=invalid-session')
                    return false
                } else {
                    return true
                }

            }
        } catch (err) {
            try {
                res.redirect('/auth/login?msg=invalid-session')
                return false
            } catch (err) {
                return false
            }
        }

    },


    hasPermission: (session, res, perm) => {
        try {

            if (session === undefined || session === null || typeof session != 'object') {
                res.redirect('/auth/login?msg=invalid-session')
                return false
            } else {

                if (session.valid != true) {
                    res.redirect('/auth/login?msg=invalid-session')
                    return false
                } else {

                    if (perm === undefined || perm === null || typeof perm != 'string') {
                        console.error(`invalid perm | perm must be string, received '${perm} ${typeof perm}'`)
                        res.redirect(`${login_redirect}?msg=permission-denied`)
                        return false
                    } else {

                        if (session.perms[perm] != true) {
                            res.redirect(`${login_redirect}?msg=permission-denied`)
                            return false
                        } else {
                            return true
                        }

                    }
                }

            }
        } catch (err) {
            try {
                res.redirect(`${login_redirect}?msg=permission-denied`)
                return false
            } catch (err) {
                return false
            }
        }
    },
    /* END PERMISSION METHODS */








    /* BEGIN TEMPKEY EMAIL METHODS */
    sendTempkeyEmail: async (dtb, args, callback) => {
        // args = {
        //     recipient:user_email,
        //     subject
        //     text:text
        //     html:html
        // }

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
    /* END TEMPKEY EMAIL METHODS */








    /* BEGIN SESSION MANAGEMENT METHODS */
    login: (dtb, args, callback) => {
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
                } else {

                    dtb.all('SELECT * FROM auth WHERE email = ?;', [
                        args.email
                    ], (err, rows) => {
                        if (err) {
                            callback(err);
                            resolve();
                        } else if (rows.length == 0) {
                            callback({
                                'message': 'Credentials failed'
                            });
                            resolve();
                        } else {

                            if (rows[0].failed_login_attempts >= lockout_policy) {
                                callback({
                                    'message': 'too many failed login attempts, contact your administrator to unlock your account'
                                });
                                resolve();
                            } else if (hash(args.password) != rows[0].hash) {
                                dtb.run('UPDATE auth SET failed_login_attempts = ? WHERE email = ?;', [
                                    (rows[0].failed_login_attempts + 1),
                                    args.email
                                ], async function (err) {
                                    if (err) {
                                        callback({
                                            'message': `Credentials failed | ${err.message}`
                                        });
                                        resolve();
                                    } else if (this.changes == 0) {
                                        callback(
                                            {
                                                'message': `Credentials failed | Row(s) affected: ${this.changes}`
                                            }
                                        );
                                        resolve();
                                    } else {
                                        callback({
                                            'message': 'Credentials failed | login attempts incremented'
                                        });
                                        resolve();
                                    }
                                });
                            } else {
                                // args.session.email = rows[0].email;
                                // args.session.id = rows[0].id;
                                // args.session.perms = JSON.parse(rows[0].perms);
                                // args.session.valid = true;
                                // args.session.status = rows[0].status;

                                callback(null, {
                                    email: rows[0].email,
                                    id: rows[0].id,
                                    perms: JSON.parse(rows[0].perms),
                                    valid: true,
                                    status: rows[0].status,
                                });
                                resolve();
                            }
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


    logout: (session, callback) => {
        return new Promise((resolve) => {
            try {

                if (session === undefined || session === null || typeof session != 'object') {
                    callback({
                        'message': `invalid session | session must be object, received '${session} ${typeof session}'`
                    });
                    resolve();
                } else {

                    session.valid = false;
                    session.email = null;
                    session.id = null;
                    session.perms = null;
                    session.status = null;

                    callback(null, session);
                    resolve();

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


    refreshSession: (dtb, session, callback) => {
        return new Promise((resolve) => {
            try {

                if (session === undefined || session === null || typeof session != 'object') {
                    callback({
                        'message': `invalid session | session must be object, received '${session} ${typeof session}'`
                    });
                    resolve();
                } else {

                    dtb.all('SELECT * FROM auth WHERE email = ?;', [
                        session.email
                    ], (err, rows) => {
                        if (err) {
                            callback(err);
                            resolve();
                        } else if (rows.length == 0) {
                            callback({
                                'message': 'Credentials failed'
                            });
                            resolve();
                        } else {

                            callback(null, {
                                email: rows[0].email,
                                id: rows[0].id,
                                perms: JSON.parse(rows[0].perms),
                                valid: true,
                                status: rows[0].status,
                            });

                        }
                    })
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
    /* END SESSION MANAGEMENT METHODS */








    /* BEGIN USER MANAGEMENT METHODS */
    createUser: (dtb, args, callback) => {
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
                } else if (args.created_by === undefined || args.created_by === null || typeof Number(args.created_by) != 'number') {
                    callback({
                        'message': `invalid args.created_by | args.created_by must be number, received '${Number(args.created_by)} ${typeof Number(args.created_by)}'`
                    });
                    resolve();
                } else {

                    dtb.run('INSERT INTO auth(email, hash, perms, created_at, created_by, status) VALUES(?, ?, ?, ?, ?, ?);', [
                        args.email,
                        hash(args.password),
                        JSON.stringify(default_perms),
                        `${new Date}`,
                        Number(args.created_by),
                        'unverified'
                    ], (err) => {
                        if (err) {
                            callback(err);
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


    readUser: (dtb, args, callback) => {
        return new Promise((resolve) => {
            try {

                tryCreateTable(dtb);

                if (args.email === undefined) {
                    callback({
                        'message': 'missing args | args.email is undefined'
                    });
                    resolve();
                } else if (typeof args.email != 'string') {
                    callback({
                        'message': 'missing args | args.email is undefined'
                    });
                    resolve();


                } else {

                    dtb.all(
                        `SELECT id, status, email, perms, tempkey_datetime, failed_login_attempts, created_at, created_by FROM auth WHERE email = ?;`,
                        [args.email],
                        (err, rows) => {
                            if (err) {

                                callback(err);
                                resolve();

                            } else if (rows.length == 0) {

                                callback({
                                    'message': 'entry not found'
                                });
                                resolve();

                            } else {

                                callback(null, rows[0]);
                                resolve();

                            }
                        }
                    );
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


    readUsers: (dtb, args, callback) => {
        return new Promise((resolve) => {
            try {

                tryCreateTable(dtb);

                if (args.email === undefined) {
                    callback({
                        'message': 'missing args | args.email is undefined'
                    });
                    resolve();
                } else if (typeof args.email != 'string') {
                    callback({
                        'message': 'missing args | args.email is undefined'
                    });
                    resolve();


                } else {

                    dtb.all(
                        `SELECT id, status, email, perms, tempkey_datetime, failed_login_attempts, created_at, created_by FROM auth WHERE email = ?;`,
                        [args.email],
                        (err, rows) => {
                            if (err) {

                                callback(err);
                                resolve();

                            } else if (rows.length == 0) {

                                callback({
                                    'message': 'entry not found'
                                });
                                resolve();

                            } else {

                                callback(null, rows);
                                resolve();

                            }
                        }
                    );
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


    updateUser: (dtb, args, callback) => {
        return new Promise((resolve) => {
            try {

                if (!allValuesAreStringsOrBools(args)) {
                    callback({
                        'message': 'non-string values detected'
                    });
                    resolve();
                } else {

                    if (args.update_field === undefined) {
                        callback({
                            'message': 'missing args | update_field is undefined'
                        });
                        resolve();
                    } else if (args.update_params === undefined) {
                        callback({
                            'message': 'missing args | update_params is undefined'
                        });
                        resolve();
                    } else if (args.update_params.data === undefined) {
                        callback({
                            'message': 'missing args | update_params.data is undefined'
                        });
                        resolve();
                    } else if (args.email === undefined) {
                        callback({
                            'message': 'missing args | email is undefined'
                        });
                        resolve();
                    } else {

                        var execute = false;

                        if (args.update_field == 'status' || args.update_field == 'email' || args.update_field == 'perms' || args.update_field == 'tempkey_datetime' || args.update_field == 'failed_login_attempts') {
                            if (args.update_field == 'perms') {
                                if (typeof args.update_params.data != 'object') {

                                    callback({
                                        'message': 'missing args | perms must be object'
                                    });
                                    resolve();

                                } else {

                                    try {
                                        args.update_params.data = JSON.stringify(args.update_params.data);

                                        execute = true;
                                    } catch (err) {

                                        callback(err);
                                        resolve();
                                    }
                                }
                            } else {
                                execute = true;
                            }

                            if (execute) {
                                dtb.run(`UPDATE auth SET ${args.update_field} = ? WHERE email = ?;`, [args.update_params.data, args.email], async function (err) {
                                    if (err) {

                                        callback(err);
                                        resolve();
                                    } else if (this.changes == 0) {

                                        callback(
                                            {
                                                'message': `Row(s) affected: ${this.changes}`
                                            },
                                            {
                                                'count': this.changes,
                                                'message': `Row(s) affected: ${this.changes}`
                                            }
                                        );
                                        resolve();
                                    } else {

                                        if (args.update_field == 'hash') {
                                            dtb.run(`UPDATE auth SET failed_login_attempts = 0 WHERE email = ?;`, [args.email], async function (err) {
                                                if (err) {

                                                    callback(err);
                                                    resolve();
                                                } else if (this.changes == 0) {

                                                    callback(
                                                        {
                                                            'message': `Row(s) affected: ${this.changes}`
                                                        },
                                                        {
                                                            'count': this.changes,
                                                            'message': `Row(s) affected: ${this.changes}`
                                                        }
                                                    );
                                                    resolve();
                                                } else {

                                                    callback(
                                                        null,
                                                        {
                                                            'count': this.changes,
                                                            'message': `Row(s) affected: ${this.changes}`
                                                        }
                                                    );
                                                    resolve();
                                                }
                                            });
                                        } else {
                                            callback(
                                                null,
                                                {
                                                    'count': this.changes,
                                                    'message': `Row(s) affected: ${this.changes}`
                                                }
                                            );
                                            resolve();
                                        }
                                    }
                                });
                            }
                        } else {
                            callback({
                                'message': 'missing args | update_field is invalid'
                            });
                            resolve();
                        }
                    }
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


    // 2.0 conventions
    deleteUser: (dtb, email, callback) => {
        return new Promise((resolve) => {
            try {

                if (email === undefined || email === null || typeof email != 'string') {
                    callback({
                        'message': `invalid email | email must be string, received '${email} ${typeof email}'`
                    });
                    resolve();
                } else {

                    dtb.all('SELECT * FROM auth WHERE email = ?;', [
                        args.email
                    ], function (err, rows) {
                        if (err) {
                            callback(err);
                            resolve();
                        } else if (rows.length == 0) {
                            callback({
                                'message': 'entry not found'
                            });
                            resolve();
                        } else {

                            dtb.run('INSERT INTO auth_archive(id, email, status, perms, created_at, created_by, archived_at) VALUES(?,?,?,?,?,?,?);', [
                                rows[0].id,
                                rows[0].email,
                                rows[0].status,
                                rows[0].perms,
                                rows[0].created_at,
                                rows[0].created_by,
                                `${new Date}`,
                            ], function (err) {
                                if (err) {
                                    callback(err);
                                    resolve();
                                } else if (this.changes == 0) {
                                    callback({
                                        'message': `Row(s) affected: ${this.changes}`
                                    });
                                    resolve();
                                } else {

                                    callback(null);
                                    resolve();
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


    // 2.0 conventions
    allUsers: (dtb, callback) => {
        return new Promise((resolve) => {
            try {

                dtb.all('SELECT id, status, email, perms, tempkey_datetime, failed_login_attempts, created_at, created_by FROM auth;', [], (err, rows) => {
                    if (err) {
                        callback(err);
                        resolve();
                    } else {
                        callback(null, rows);
                        resolve();
                    }
                });

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


    // 2.0 conventions
    changePassword: (dtb, args, callback) => {
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
                } else {

                    dtb.run(`UPDATE auth SET hash = ? WHERE email = ?;`, [
                        hash(args.password),
                        args.email
                    ], function (err) {
                        if (err) {
                            callback(err);
                            resolve();
                        } else if (this.changes == 0) {
                            callback({
                                'message': `Row(s) affected: ${this.changes}`
                            });
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
    /* BEGIN USER MANAGEMENT METHODS */








    /* BEGIN ADMIN METHODS */
    // 2.0 conventions
    lockAccount: (dtb, email, callback) => {
        return new Promise((resolve) => {
            try {

                if (email === undefined || email === null || typeof email != 'string') {
                    callback({
                        'message': `invalid email | email must be string, received '${email} ${typeof email}'`
                    });
                    resolve();
                } else {

                    dtb.run(`UPDATE auth SET locked = ? WHERE email = ?;`, [
                        1,
                        email
                    ], function (err) {
                        if (err) {
                            callback(err);
                            resolve();
                        } else if (this.changes == 0) {
                            callback({
                                'message': `Row(s) affected: ${this.changes}`
                            });
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


    // 2.0 conventions
    unlockAccount: (dtb, email, callback) => {
        return new Promise((resolve) => {
            try {

                if (email === undefined || email === null || typeof email != 'string') {
                    callback({
                        'message': `invalid email | email must be string, received '${email} ${typeof email}'`
                    });
                    resolve();
                } else {

                    dtb.run(`UPDATE auth SET locked = ? WHERE email = ?;`, [
                        0,
                        email
                    ], function (err) {
                        if (err) {
                            callback(err);
                            resolve();
                        } else if (this.changes == 0) {
                            callback({
                                'message': `Row(s) affected: ${this.changes}`
                            });
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
    /* END ADMIN METHODS */




}