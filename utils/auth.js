const { hash } = require(`${__dirname}/hashing.js`)
const { tempkey } = require(`${__dirname}/hashing.js`)


module.exports = {


    /* BEGIN CONFIG METHODS */
    // 2.0 conventions
    connectToDatabase: (path, callback) => {
        return new Promise((resolve) => {
            try {

                if (path === undefined || path === null || typeof path != 'string') {
                    callback({
                        'message': `invalid args | path must be string, received '${path} ${typeof path}'`
                    });
                    resolve();
                } else {

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
    defaultPerms: (perms, callback) => {
        return new Promise((resolve) => {
            try {

                // TODO implement this object validation standard package wide
                if (perms === undefined || perms === null || typeof perms != 'object' || Object.keys(perms).length == 0) {
                    try {
                        callback({
                            'message': `invalid args | perms must be non-empty object, received ${typeof perms} ${JSON.stringify(perms)} with length ${Object.keys(perms).length}`
                        });
                        resolve();
                    } catch (err) {
                        callback({
                            'message': `invalid args | perms must be non-empty object, received ${typeof perms} ${JSON.stringify(perms)}`
                        });
                        resolve();
                    }
                } else {

                    global.default_perms = perms
                    callback(null)
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


    // 2.0 conventions
    lockoutPolicy: (attempts, callback) => {
        return new Promise((resolve) => {
            try {

                if (attempts === undefined || attempts === null || typeof Number(attempts) != 'number') {
                    callback({
                        'message': `invalid args | url must be string, received '${Number(attempts)} ${typeof Number(attempts)}'`
                    });
                    resolve();
                } else {

                    global.lockout_policy = Number(attempts)
                    callback(null)
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


    // 2.0 conventions
    loginRedirect: (url, callback) => {
        return new Promise((resolve) => {
            try {

                if (url === undefined || url === null || typeof url != 'string') {
                    callback({
                        'message': `invalid args | url must be string, received '${url} ${typeof url}'`
                    });
                    resolve();
                } else {

                    global.login_redirect = url
                    callback(null)
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
    // 2.0 conventions
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


    // 2.0 conventions
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








    /* BEGIN SESSION MANAGEMENT METHODS */
    // 2.0 conventions
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


    // 2.0 conventions
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


    // 2.0 conventions
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








    /* BEGIN TEMPKEY EMAIL METHODS */
    // 2.0 convenntions
    sendTempkeyEmail: async (dtb, args, callback) => {
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


    // 2.0 conventions
    verifyUser: async (dtb, args, callback) => {

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
                } else if (args.tempkey === undefined || args.tempkey === null || typeof args.tempkey != 'string') {
                    callback({
                        'message': `invalid args.tempkey | args.tempkey must be number, received '${args.tempkey} ${typeof args.tempkey}'`
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


    // 2.0 conventions
    resetPassword: async (dtb, args, callback) => {

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








    /* BEGIN USER MANAGEMENT METHODS */
    // 2.0 conventions
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


    // 2.0 conventions
    readUser: (dtb, email, callback) => {
        return new Promise((resolve) => {
            try {

                if (email === undefined || email === null || typeof email != 'string') {
                    callback({
                        'message': `invalid email | email must be string, received '${email} ${typeof email}'`
                    });
                    resolve();
                } else {

                    dtb.all('SELECT id, status, email, perms, tempkey_datetime, failed_login_attempts, created_at, created_by FROM auth WHERE email = ?;', [
                        email
                    ], (err, rows) => {
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
    readUsers: (dtb, email, callback) => {
        return new Promise((resolve) => {
            try {

                if (email === undefined || email === null || typeof email != 'string') {
                    callback({
                        'message': `invalid email | email must be string, received '${email} ${typeof email}'`
                    });
                    resolve();
                } else {

                    dtb.all('SELECT id, status, email, perms, tempkey_datetime, failed_login_attempts, created_at, created_by FROM auth WHERE email = ?;', [
                        email
                    ], (err, rows) => {
                        if (err) {
                            callback(err);
                            resolve();
                        } else if (rows.length == 0) {
                            callback({
                                'message': 'entries not found'
                            });
                            resolve();
                        } else {
                            callback(null, rows);
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

                dtb.all('SELECT id, status, email, perms, created_at, created_by FROM auth;', [], (err, rows) => {
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

                    dtb.run('UPDATE auth SET hash = ? WHERE email = ?;', [
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

                    dtb.run('UPDATE auth SET locked = ? WHERE email = ?;', [
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

                    dtb.run('UPDATE auth SET locked = ? WHERE email = ?;', [
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