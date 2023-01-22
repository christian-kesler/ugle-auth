const { hash } = require(`${__dirname}/hashing.js`)
const { tempkey } = require(`${__dirname}/hashing.js`)
const sqlite3 = require('sqlite3');
const bcrypt = require('bcrypt');
const fs = require('fs');
// TODO verify console output on invalid callback
// 



function isValidEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
function isValidPassword(password) {
    var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,32})/;
    return re.test(password);
}

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

                } else if (!fs.existsSync(path)) {
                    callback({
                        'message': `invalid args | path provided does not exist '${path} ${typeof path}'`
                    });
                    resolve();
                } else {

                    const dtb = new sqlite3.Database(path, sqlite3.OPEN_READWRITE, async (err) => {
                        if (err) {
                            callback(err);
                            resolve();
                        }
                    })

                    global.default_perms = {
                        'admin': false,
                        'user': true
                    }
                    global.lockout_policy = 4;
                    global.login_redirect = '/account/home';

                    // dtb.exec('DROP TABLE IF EXISTS auth;');
                    // dtb.exec('DROP TABLE IF EXISTS auth_archive;');
                    // dtb.exec('DROP TABLE IF EXISTS auth_log;');

                    // dtb.exec(
                    //     `CREATE TABLE IF NOT EXISTS auth(
                    //         'id' INTEGER PRIMARY KEY AUTOINCREMENT,
                    //         'email' VARCHAR(255) UNIQUE,

                    //         'hash' VARCHAR(255),
                    //         'status' VARCHAR(255),
                    //         'perms' TEXT,

                    //         'tempkey' VARCHAR(255),
                    //         'tempkey_datetime' DATETIME,
                    //         'failed_login_attempts' INTEGER,

                    //         'created_at' DATETIME,
                    //         'created_by' VARCHAR(255)
                    //     );`
                    // );

                    // dtb.exec(
                    //     `CREATE TABLE IF NOT EXISTS auth_archive(
                    //         'id' INTEGER,
                    //         'email' VARCHAR(255),

                    //         'status' VARCHAR(255),
                    //         'perms' TEXT,

                    //         'created_at' DATETIME,
                    //         'created_by' VARCHAR(255),

                    //         'archived_at' DATETIME
                    //     );`
                    // );

                    // dtb.exec(
                    //     `CREATE TABLE IF NOT EXISTS auth_log(
                    //         'id' INTEGER PRIMARY KEY AUTOINCREMENT,

                    //         'action' VARCHAR(255),
                    //         'recipient' VARCHAR(255),
                    //         'data' TEXT,

                    //         'performed_at' DATETIME,
                    //         'performed_by' VARCHAR(255)
                    //     );`
                    // );

                    callback(null, dtb);
                    resolve();
                }

            } catch (err) {
                try {
                    callback(err);
                    resolve();
                } catch (err) {
                    console.log(err)
                    resolve();
                }
            }
        });
    },


    // 2.0 conventions
    formatDatabase: (dtb, callback) => {
        return new Promise((resolve) => {
            try {

                dtb.exec('DROP TABLE IF EXISTS auth;');
                dtb.exec('DROP TABLE IF EXISTS auth_archive;');
                dtb.exec('DROP TABLE IF EXISTS auth_log;');

                dtb.exec(
                    `CREATE TABLE IF NOT EXISTS auth(
                        'id' INTEGER PRIMARY KEY AUTOINCREMENT,
                        'email' VARCHAR(255) UNIQUE,
                        
                        'hash' VARCHAR(255),
                        'status' VARCHAR(255),
                        'perms' TEXT,
                        'locked' INTEGER,
                        
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

            } catch (err) {
                try {
                    callback(err);
                    resolve();
                } catch (err) {
                    console.log(err)
                    resolve();
                }
            }
        });
    },


    // 2.0 conventions
    defaultPerms: (perms, callback) => {
        return new Promise((resolve) => {
            try {

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

                attempts = Number(attempts)
                if (attempts == undefined || attempts == null || isNaN(attempts) || attempts <= 0) {
                    callback({
                        'message': `invalid args | attempts must be number greater than zero, received '${attempts} ${typeof attempts}'`
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








    /* BEGIN USER MANAGEMENT METHODS */
    // 2.0 conventions
    createUser: (dtb, args, callback) => {
        return new Promise((resolve) => {
            try {

                // callback validation
                if (callback == undefined || callback == null || typeof callback != 'function') {
                    console.log(`invalid callback | callback must be function, received '${callback} ${typeof callback}'`)
                    resolve();


                    // database validation
                } else if (dtb === undefined || dtb === null || typeof dtb != 'object') {
                    callback({
                        'message': `invalid dtb | dtb must be object, received ${typeof dtb} ${JSON.stringify(dtb)}`
                    });
                    resolve();
                } else if (dtb.exec === undefined || dtb.exec === null || typeof dtb.exec != 'function') {
                    callback({
                        'message': `invalid dtb.exec | dtb.exec must be function, received ${typeof dtb.exec} ${JSON.stringify(dtb.exec)}`
                    });
                    resolve();
                } else if (dtb.run === undefined || dtb.run === null || typeof dtb.run != 'function') {
                    callback({
                        'message': `invalid dtb.run | dtb.run must be function, received ${typeof dtb.run} ${JSON.stringify(dtb.run)}`
                    });
                    resolve();
                } else if (dtb.all === undefined || dtb.all === null || typeof dtb.all != 'function') {
                    callback({
                        'message': `invalid dtb.all | dtb.all must be function, received ${typeof dtb.all} ${JSON.stringify(dtb.all)}`
                    });
                    resolve();

                    // args validation
                } else if (args === undefined || args === null || typeof args != 'object' || Object.keys(args).length == 0) {
                    try {
                        callback({
                            'message': `invalid args | args must be non-empty object, received ${typeof args} ${JSON.stringify(args)} with length ${Object.keys(args).length}`
                        });
                        resolve();
                    } catch (err) {
                        callback({
                            'message': `invalid args | args must be non-empty object, received ${typeof args} ${JSON.stringify(args)}`
                        });
                        resolve();
                    }

                    // args details
                } else if (args.email === undefined || args.email === null || typeof args.email != 'string' || args.email == '' || !isValidEmail(args.email)) {
                    callback({
                        'message': `invalid args.email | args.email must be valid email string, received '${args.email} ${typeof args.email}'`
                    });
                    resolve();
                } else if (args.password === undefined || args.password === null || typeof args.password != 'string' || args.password == '' || !isValidPassword(args.password)) {
                    callback({
                        'message': `invalid args.password | args.password must be 8 to 32 character string with lowercase, uppercase, number, and special chars, received '${args.password} ${typeof args.password}'`
                    });
                    resolve();
                } else if (Number(args.created_by) == undefined || Number(args.created_by) == null || isNaN(Number(args.created_by)) || Number(args.created_by) < 0) {
                    callback({
                        'message': `invalid args.created_by | args.created_by must be non-negative number, received '${Number(args.created_by)} ${typeof Number(args.created_by)}'`
                    });
                    resolve();
                } else {

                    bcrypt.hash(args.password, 16, (err, hash) => {
                        if (err) {
                            callback(err);
                            resolve();
                        } else {
                            dtb.run('INSERT INTO auth(email, hash, perms, created_at, created_by, status) VALUES(?, ?, ?, ?, ?, ?);', [
                                args.email,
                                hash,
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

                // callback validation
                if (callback == undefined || callback == null || typeof callback != 'function') {
                    console.log(`invalid callback | callback must be function, received '${callback} ${typeof callback}'`)
                    resolve();


                    // database validation
                } else if (dtb === undefined || dtb === null || typeof dtb != 'object') {
                    callback({
                        'message': `invalid dtb | dtb must be object, received ${typeof dtb} ${JSON.stringify(dtb)}`
                    });
                    resolve();
                } else if (dtb.exec === undefined || dtb.exec === null || typeof dtb.exec != 'function') {
                    callback({
                        'message': `invalid dtb.exec | dtb.exec must be function, received ${typeof dtb.exec} ${JSON.stringify(dtb.exec)}`
                    });
                    resolve();
                } else if (dtb.run === undefined || dtb.run === null || typeof dtb.run != 'function') {
                    callback({
                        'message': `invalid dtb.run | dtb.run must be function, received ${typeof dtb.run} ${JSON.stringify(dtb.run)}`
                    });
                    resolve();
                } else if (dtb.all === undefined || dtb.all === null || typeof dtb.all != 'function') {
                    callback({
                        'message': `invalid dtb.all | dtb.all must be function, received ${typeof dtb.all} ${JSON.stringify(dtb.all)}`
                    });
                    resolve();

                    // args validation
                } else if (email === undefined || email === null || typeof email != 'string') {
                    callback({
                        'message': `invalid email | email must be string, received '${email} ${typeof email}'`
                    });
                    resolve();
                } else {

                    dtb.all(
                        `SELECT
                            id,
                            email,
                            
                            status,
                            perms,
                            locked,

                            tempkey_datetime,
                            failed_login_attempts,
                            
                            created_at,
                            created_by
                        FROM auth WHERE email = ?;`, [
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

                // callback validation
                if (callback == undefined || callback == null || typeof callback != 'function') {
                    console.log(`invalid callback | callback must be function, received '${callback} ${typeof callback}'`)
                    resolve();


                    // database validation
                } else if (dtb === undefined || dtb === null || typeof dtb != 'object') {
                    callback({
                        'message': `invalid dtb | dtb must be object, received ${typeof dtb} ${JSON.stringify(dtb)}`
                    });
                    resolve();
                } else if (dtb.exec === undefined || dtb.exec === null || typeof dtb.exec != 'function') {
                    callback({
                        'message': `invalid dtb.exec | dtb.exec must be function, received ${typeof dtb.exec} ${JSON.stringify(dtb.exec)}`
                    });
                    resolve();
                } else if (dtb.run === undefined || dtb.run === null || typeof dtb.run != 'function') {
                    callback({
                        'message': `invalid dtb.run | dtb.run must be function, received ${typeof dtb.run} ${JSON.stringify(dtb.run)}`
                    });
                    resolve();
                } else if (dtb.all === undefined || dtb.all === null || typeof dtb.all != 'function') {
                    callback({
                        'message': `invalid dtb.all | dtb.all must be function, received ${typeof dtb.all} ${JSON.stringify(dtb.all)}`
                    });
                    resolve();

                    // args validation
                } else if (email === undefined || email === null || typeof email != 'string') {
                    callback({
                        'message': `invalid email | email must be string, received '${email} ${typeof email}'`
                    });
                    resolve();
                } else {

                    dtb.all(
                        `SELECT
                            id,
                            email,
                            
                            status,
                            perms,
                            locked,
                            
                            tempkey_datetime,
                            failed_login_attempts,
                            
                            created_at,
                            created_by
                        FROM auth WHERE email = ?;`, [
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

                // callback validation
                if (callback == undefined || callback == null || typeof callback != 'function') {
                    console.log(`invalid callback | callback must be function, received '${callback} ${typeof callback}'`)
                    resolve();


                    // database validation
                } else if (dtb === undefined || dtb === null || typeof dtb != 'object') {
                    callback({
                        'message': `invalid dtb | dtb must be object, received ${typeof dtb} ${JSON.stringify(dtb)}`
                    });
                    resolve();
                } else if (dtb.exec === undefined || dtb.exec === null || typeof dtb.exec != 'function') {
                    callback({
                        'message': `invalid dtb.exec | dtb.exec must be function, received ${typeof dtb.exec} ${JSON.stringify(dtb.exec)}`
                    });
                    resolve();
                } else if (dtb.run === undefined || dtb.run === null || typeof dtb.run != 'function') {
                    callback({
                        'message': `invalid dtb.run | dtb.run must be function, received ${typeof dtb.run} ${JSON.stringify(dtb.run)}`
                    });
                    resolve();
                } else if (dtb.all === undefined || dtb.all === null || typeof dtb.all != 'function') {
                    callback({
                        'message': `invalid dtb.all | dtb.all must be function, received ${typeof dtb.all} ${JSON.stringify(dtb.all)}`
                    });
                    resolve();

                    // args validation
                } else if (email === undefined || email === null || typeof email != 'string') {
                    callback({
                        'message': `invalid email | email must be string, received '${email} ${typeof email}'`
                    });
                    resolve();
                } else {

                    dtb.all('SELECT * FROM auth WHERE email = ?;', [
                        email
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

                // callback validation
                if (callback == undefined || callback == null || typeof callback != 'function') {
                    console.log(`invalid callback | callback must be function, received '${callback} ${typeof callback}'`)
                    resolve();


                    // database validation
                } else if (dtb === undefined || dtb === null || typeof dtb != 'object') {
                    callback({
                        'message': `invalid dtb | dtb must be object, received ${typeof dtb} ${JSON.stringify(dtb)}`
                    });
                    resolve();
                } else if (dtb.exec === undefined || dtb.exec === null || typeof dtb.exec != 'function') {
                    callback({
                        'message': `invalid dtb.exec | dtb.exec must be function, received ${typeof dtb.exec} ${JSON.stringify(dtb.exec)}`
                    });
                    resolve();
                } else if (dtb.run === undefined || dtb.run === null || typeof dtb.run != 'function') {
                    callback({
                        'message': `invalid dtb.run | dtb.run must be function, received ${typeof dtb.run} ${JSON.stringify(dtb.run)}`
                    });
                    resolve();
                } else if (dtb.all === undefined || dtb.all === null || typeof dtb.all != 'function') {
                    callback({
                        'message': `invalid dtb.all | dtb.all must be function, received ${typeof dtb.all} ${JSON.stringify(dtb.all)}`
                    });
                    resolve();
                } else {
                    dtb.all(
                        `SELECT
                            id,
                            email,
                            
                            status,
                            perms,
                            locked,
                            
                            tempkey_datetime,
                            failed_login_attempts,
                            
                            created_at,
                            created_by
                        FROM auth;`, [], (err, rows) => {
                        if (err) {
                            callback(err);
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
    changePassword: (dtb, args, callback) => {
        return new Promise((resolve) => {
            try {

                // callback validation
                if (callback == undefined || callback == null || typeof callback != 'function') {
                    console.log(`invalid callback | callback must be function, received '${callback} ${typeof callback}'`)
                    resolve();


                    // database validation
                } else if (dtb === undefined || dtb === null || typeof dtb != 'object') {
                    callback({
                        'message': `invalid dtb | dtb must be object, received ${typeof dtb} ${JSON.stringify(dtb)}`
                    });
                    resolve();
                } else if (dtb.exec === undefined || dtb.exec === null || typeof dtb.exec != 'function') {
                    callback({
                        'message': `invalid dtb.exec | dtb.exec must be function, received ${typeof dtb.exec} ${JSON.stringify(dtb.exec)}`
                    });
                    resolve();
                } else if (dtb.run === undefined || dtb.run === null || typeof dtb.run != 'function') {
                    callback({
                        'message': `invalid dtb.run | dtb.run must be function, received ${typeof dtb.run} ${JSON.stringify(dtb.run)}`
                    });
                    resolve();
                } else if (dtb.all === undefined || dtb.all === null || typeof dtb.all != 'function') {
                    callback({
                        'message': `invalid dtb.all | dtb.all must be function, received ${typeof dtb.all} ${JSON.stringify(dtb.all)}`
                    });
                    resolve();

                    // args validation
                } else if (args === undefined || args === null || typeof args != 'object' || Object.keys(args).length == 0) {
                    try {
                        callback({
                            'message': `invalid args | args must be non-empty object, received ${typeof args} ${JSON.stringify(args)} with length ${Object.keys(args).length}`
                        });
                        resolve();
                    } catch (err) {
                        callback({
                            'message': `invalid args | args must be non-empty object, received ${typeof args} ${JSON.stringify(args)}`
                        });
                        resolve();
                    }

                    // args details
                } else if (args.email === undefined || args.email === null || typeof args.email != 'string') {
                    callback({
                        'message': `invalid args.email | args.email must be string, received '${args.email} ${typeof args.email}'`
                    });
                    resolve();
                } else if (args.password === undefined || args.password === null || typeof args.password != 'string' || args.password == '' || !isValidPassword(args.password)) {
                    callback({
                        'message': `invalid args.password | args.password must be 8 to 32 character string with lowercase, uppercase, number, and special chars, received '${args.password} ${typeof args.password}'`
                    });
                    resolve();
                } else {

                    bcrypt.hash(args.password, 16, (err, hash) => {
                        if (err) {
                            callback(err);
                            resolve();
                        } else {

                            dtb.run('UPDATE auth SET hash = ? WHERE email = ?;', [
                                hash,
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
    /* END USER MANAGEMENT METHODS */








    /* BEGIN SESSION MANAGEMENT METHODS */
    // 2.0 conventions
    login: (dtb, args, callback) => {
        return new Promise((resolve) => {
            try {

                // callback validation
                if (callback == undefined || callback == null || typeof callback != 'function') {
                    console.log(`invalid callback | callback must be function, received '${callback} ${typeof callback}'`)
                    resolve();


                    // database validation
                } else if (dtb === undefined || dtb === null || typeof dtb != 'object') {
                    callback({
                        'message': `invalid dtb | dtb must be object, received ${typeof dtb} ${JSON.stringify(dtb)}`
                    });
                    resolve();
                } else if (dtb.exec === undefined || dtb.exec === null || typeof dtb.exec != 'function') {
                    callback({
                        'message': `invalid dtb.exec | dtb.exec must be function, received ${typeof dtb.exec} ${JSON.stringify(dtb.exec)}`
                    });
                    resolve();
                } else if (dtb.run === undefined || dtb.run === null || typeof dtb.run != 'function') {
                    callback({
                        'message': `invalid dtb.run | dtb.run must be function, received ${typeof dtb.run} ${JSON.stringify(dtb.run)}`
                    });
                    resolve();
                } else if (dtb.all === undefined || dtb.all === null || typeof dtb.all != 'function') {
                    callback({
                        'message': `invalid dtb.all | dtb.all must be function, received ${typeof dtb.all} ${JSON.stringify(dtb.all)}`
                    });
                    resolve();

                    // args validation
                } else if (args === undefined || args === null || typeof args != 'object' || Object.keys(args).length == 0) {
                    try {
                        callback({
                            'message': `invalid args | args must be non-empty object, received ${typeof args} ${JSON.stringify(args)} with length ${Object.keys(args).length}`
                        });
                        resolve();
                    } catch (err) {
                        callback({
                            'message': `invalid args | args must be non-empty object, received ${typeof args} ${JSON.stringify(args)}`
                        });
                        resolve();
                    }

                    // args details
                } else if (args.email === undefined || args.email === null || typeof args.email != 'string') {
                    callback({
                        'message': `invalid args.email | args.email must be string, received '${args.email} ${typeof args.email}'`
                    });
                    resolve();
                } else if (args.password === undefined || args.password === null || typeof args.password != 'string' || args.password == '' || !isValidPassword(args.password)) {
                    callback({
                        'message': `invalid args.password | args.password must be 8 to 32 character string with lowercase, uppercase, number, and special chars, received '${args.password} ${typeof args.password}'`
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
                            } else {
                                // Compare the hashed password from the database with the hashed password from the user input
                                bcrypt.compare(args.password, rows[0].hash, (err, result) => {
                                    if (err) {
                                        callback({
                                            'message': `Credentials failed | ${err.message}`
                                        });
                                        resolve();
                                    }
                                    if (!result) {
                                        dtb.run('UPDATE auth SET failed_login_attempts = ? WHERE email = ?;', [
                                            (rows[0].failed_login_attempts + 1),
                                            args.email
                                        ], (err) => {
                                            if (err) {
                                                callback({
                                                    'message': `Credentials failed | ${err.message}`
                                                });
                                                resolve();
                                            } else {
                                                callback({
                                                    'message': 'Credentials failed | login attempts incremented'
                                                });
                                                resolve();
                                            }
                                        });
                                    } else {
                                        // reset the failed login attempts
                                        dtb.run('UPDATE auth SET failed_login_attempts = 0 WHERE email = ?;', [
                                            args.email
                                        ], (err) => {
                                            if (err) {
                                                callback({
                                                    'message': `Credentials success | failed to reset login attempts | ${err.message}`
                                                });
                                                resolve();
                                            } else {
                                                // args.session.email = rows[0].email;
                                                // args.session.id = rows[0].id;
                                                // args.session.valid = true;
                                                callback(null, {
                                                    email: rows[0].email,
                                                    id: rows[0].id,
                                                    perms: JSON.parse(rows[0].perms),
                                                    valid: true,
                                                    status: rows[0].status,
                                                });
                                                resolve();
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            } catch (err) {
                callback({
                    'message': `Error | ${err.message}`
                });
                resolve();
            }
        });
    },


    // 2.0 convenntions
    refreshSession: (dtb, session, callback) => {
        return new Promise((resolve) => {
            try {

                // callback validation
                if (callback == undefined || callback == null || typeof callback != 'function') {
                    console.log(`invalid callback | callback must be function, received '${callback} ${typeof callback}'`)
                    resolve();


                    // database validation
                } else if (dtb === undefined || dtb === null || typeof dtb != 'object') {
                    callback({
                        'message': `invalid dtb | dtb must be object, received ${typeof dtb} ${JSON.stringify(dtb)}`
                    });
                    resolve();
                } else if (dtb.exec === undefined || dtb.exec === null || typeof dtb.exec != 'function') {
                    callback({
                        'message': `invalid dtb.exec | dtb.exec must be function, received ${typeof dtb.exec} ${JSON.stringify(dtb.exec)}`
                    });
                    resolve();
                } else if (dtb.run === undefined || dtb.run === null || typeof dtb.run != 'function') {
                    callback({
                        'message': `invalid dtb.run | dtb.run must be function, received ${typeof dtb.run} ${JSON.stringify(dtb.run)}`
                    });
                    resolve();
                } else if (dtb.all === undefined || dtb.all === null || typeof dtb.all != 'function') {
                    callback({
                        'message': `invalid dtb.all | dtb.all must be function, received ${typeof dtb.all} ${JSON.stringify(dtb.all)}`
                    });
                    resolve();

                    // args validation
                } else if (session === undefined || session === null || typeof session != 'object' || Object.keys(session).length == 0) {
                    try {
                        callback({
                            'message': `invalid args | session must be non-empty object, received ${typeof session} ${JSON.stringify(session)} with length ${Object.keys(session).length}`
                        });
                        resolve();
                    } catch (err) {
                        callback({
                            'message': `invalid args | session must be non-empty object, received ${typeof session} ${JSON.stringify(session)}`
                        });
                        resolve();
                    }
                } else if (session.email === undefined || session.email === null || typeof session.email != 'string') {
                    callback({
                        'message': `invalid session.email | session.email must be string, received '${session.email} ${typeof session.email}'`
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
                            resolve();

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


    // 2.0 conventions
    logout: (session, callback) => {
        return new Promise((resolve) => {
            try {

                // callback validation
                if (callback == undefined || callback == null || typeof callback != 'function') {
                    console.log(`invalid callback | callback must be function, received '${callback} ${typeof callback}'`)
                    resolve();

                    // session validation
                } else if (session === undefined || session === null || typeof session != 'object' || Object.keys(session).length == 0) {
                    try {
                        callback({
                            'message': `invalid args | session must be non-empty object, received ${typeof session} ${JSON.stringify(session)} with length ${Object.keys(session).length}`
                        });
                        resolve();
                    } catch (err) {
                        callback({
                            'message': `invalid args | session must be non-empty object, received ${typeof session} ${JSON.stringify(session)}`
                        });
                        resolve();
                    }
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
    /* END SESSION MANAGEMENT METHODS */








    /* BEGIN PERMISSION METHODS */
    // 2.0 conventions
    isLoggedIn: (session, res) => {
        try {

            if (session === undefined || session === null || typeof session != 'object' || Object.keys(session).length == 0) {
                res.redirect('/auth/login?msg=invalid-session')
                return false
            } else if (res === undefined || res === null || typeof res != 'object' || Object.keys(res).length == 0) {
                console.error(`invalid args | arg2 must be express response object, received ${typeof res}`)
                return false
            } else if (res.redirect === undefined || res.redirect === null || typeof res.redirect != 'function') {
                console.error(`invalid args | arg2.redirect must be function, received ${typeof res.redirect}`)
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
                console.error(`invalid args | arg2 must be express response object with function 'redirect', received ${typeof res} with redirect attribute of ${typeof res.redirect}`)
                return false
            }
        }

    },


    // 2.0 conventions
    hasPermission: (session, res, perm) => {
        try {

            if (session === undefined || session === null || typeof session != 'object' || Object.keys(session).length == 0) {
                res.redirect('/auth/login?msg=invalid-session')
                return false
            } else if (res === undefined || res === null || typeof res != 'object' || Object.keys(res).length == 0) {
                console.error(`invalid args | arg2 must be express response object, received ${typeof res}`)
                return false
            } else if (res.redirect === undefined || res.redirect === null || typeof res.redirect != 'function') {
                console.error(`invalid args | arg2.redirect must be function, received ${typeof res.redirect}`)
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
                console.error(err.message)
                return false
            }
        }
    },
    /* END PERMISSION METHODS */








    /* BEGIN ADMIN METHODS */
    // 2.0 conventions
    lockAccount: (dtb, email, callback) => {
        return new Promise((resolve) => {
            try {

                // callback validation
                if (callback == undefined || callback == null || typeof callback != 'function') {
                    console.log(`invalid callback | callback must be function, received '${callback} ${typeof callback}'`)
                    resolve();


                    // database validation
                } else if (dtb === undefined || dtb === null || typeof dtb != 'object') {
                    callback({
                        'message': `invalid dtb | dtb must be object, received ${typeof dtb} ${JSON.stringify(dtb)}`
                    });
                    resolve();
                } else if (dtb.exec === undefined || dtb.exec === null || typeof dtb.exec != 'function') {
                    callback({
                        'message': `invalid dtb.exec | dtb.exec must be function, received ${typeof dtb.exec} ${JSON.stringify(dtb.exec)}`
                    });
                    resolve();
                } else if (dtb.run === undefined || dtb.run === null || typeof dtb.run != 'function') {
                    callback({
                        'message': `invalid dtb.run | dtb.run must be function, received ${typeof dtb.run} ${JSON.stringify(dtb.run)}`
                    });
                    resolve();
                } else if (dtb.all === undefined || dtb.all === null || typeof dtb.all != 'function') {
                    callback({
                        'message': `invalid dtb.all | dtb.all must be function, received ${typeof dtb.all} ${JSON.stringify(dtb.all)}`
                    });
                    resolve();

                    // args validation
                } else if (email === undefined || email === null || typeof email != 'string') {
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

                // callback validation
                if (callback == undefined || callback == null || typeof callback != 'function') {
                    console.log(`invalid callback | callback must be function, received '${callback} ${typeof callback}'`)
                    resolve();


                    // database validation
                } else if (dtb === undefined || dtb === null || typeof dtb != 'object') {
                    callback({
                        'message': `invalid dtb | dtb must be object, received ${typeof dtb} ${JSON.stringify(dtb)}`
                    });
                    resolve();
                } else if (dtb.exec === undefined || dtb.exec === null || typeof dtb.exec != 'function') {
                    callback({
                        'message': `invalid dtb.exec | dtb.exec must be function, received ${typeof dtb.exec} ${JSON.stringify(dtb.exec)}`
                    });
                    resolve();
                } else if (dtb.run === undefined || dtb.run === null || typeof dtb.run != 'function') {
                    callback({
                        'message': `invalid dtb.run | dtb.run must be function, received ${typeof dtb.run} ${JSON.stringify(dtb.run)}`
                    });
                    resolve();
                } else if (dtb.all === undefined || dtb.all === null || typeof dtb.all != 'function') {
                    callback({
                        'message': `invalid dtb.all | dtb.all must be function, received ${typeof dtb.all} ${JSON.stringify(dtb.all)}`
                    });
                    resolve();

                    // args validation
                } else if (email === undefined || email === null || typeof email != 'string') {
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








    /* BEGIN TEMPKEY EMAIL METHODS */
    // 2.0 convenntions
    sendTempkeyEmail: async (dtb, args, callback) => {
        return new Promise((resolve) => {
            try {

                // callback validation
                if (callback == undefined || callback == null || typeof callback != 'function') {
                    console.log(`invalid callback | callback must be function, received '${callback} ${typeof callback}'`)
                    resolve();


                    // database validation
                } else if (dtb === undefined || dtb === null || typeof dtb != 'object') {
                    callback({
                        'message': `invalid dtb | dtb must be object, received ${typeof dtb} ${JSON.stringify(dtb)}`
                    });
                    resolve();
                } else if (dtb.exec === undefined || dtb.exec === null || typeof dtb.exec != 'function') {
                    callback({
                        'message': `invalid dtb.exec | dtb.exec must be function, received ${typeof dtb.exec} ${JSON.stringify(dtb.exec)}`
                    });
                    resolve();
                } else if (dtb.run === undefined || dtb.run === null || typeof dtb.run != 'function') {
                    callback({
                        'message': `invalid dtb.run | dtb.run must be function, received ${typeof dtb.run} ${JSON.stringify(dtb.run)}`
                    });
                    resolve();
                } else if (dtb.all === undefined || dtb.all === null || typeof dtb.all != 'function') {
                    callback({
                        'message': `invalid dtb.all | dtb.all must be function, received ${typeof dtb.all} ${JSON.stringify(dtb.all)}`
                    });
                    resolve();

                    // args validation
                } else if (args === undefined || args === null || typeof args != 'object' || Object.keys(args).length == 0) {
                    try {
                        callback({
                            'message': `invalid args | args must be non-empty object, received ${typeof args} ${JSON.stringify(args)} with length ${Object.keys(args).length}`
                        });
                        resolve();
                    } catch (err) {
                        callback({
                            'message': `invalid args | args must be non-empty object, received ${typeof args} ${JSON.stringify(args)}`
                        });
                        resolve();
                    }

                    // args details
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

                // callback validation
                if (callback == undefined || callback == null || typeof callback != 'function') {
                    console.log(`invalid callback | callback must be function, received '${callback} ${typeof callback}'`)
                    resolve();


                    // database validation
                } else if (dtb === undefined || dtb === null || typeof dtb != 'object') {
                    callback({
                        'message': `invalid dtb | dtb must be object, received ${typeof dtb} ${JSON.stringify(dtb)}`
                    });
                    resolve();
                } else if (dtb.exec === undefined || dtb.exec === null || typeof dtb.exec != 'function') {
                    callback({
                        'message': `invalid dtb.exec | dtb.exec must be function, received ${typeof dtb.exec} ${JSON.stringify(dtb.exec)}`
                    });
                    resolve();
                } else if (dtb.run === undefined || dtb.run === null || typeof dtb.run != 'function') {
                    callback({
                        'message': `invalid dtb.run | dtb.run must be function, received ${typeof dtb.run} ${JSON.stringify(dtb.run)}`
                    });
                    resolve();
                } else if (dtb.all === undefined || dtb.all === null || typeof dtb.all != 'function') {
                    callback({
                        'message': `invalid dtb.all | dtb.all must be function, received ${typeof dtb.all} ${JSON.stringify(dtb.all)}`
                    });
                    resolve();

                    // args validation
                } else if (args === undefined || args === null || typeof args != 'object' || Object.keys(args).length == 0) {
                    try {
                        callback({
                            'message': `invalid args | args must be non-empty object, received ${typeof args} ${JSON.stringify(args)} with length ${Object.keys(args).length}`
                        });
                        resolve();
                    } catch (err) {
                        callback({
                            'message': `invalid args | args must be non-empty object, received ${typeof args} ${JSON.stringify(args)}`
                        });
                        resolve();
                    }

                    // args details
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

                // callback validation
                if (callback == undefined || callback == null || typeof callback != 'function') {
                    console.log(`invalid callback | callback must be function, received '${callback} ${typeof callback}'`)
                    resolve();


                    // database validation
                } else if (dtb === undefined || dtb === null || typeof dtb != 'object') {
                    callback({
                        'message': `invalid dtb | dtb must be object, received ${typeof dtb} ${JSON.stringify(dtb)}`
                    });
                    resolve();
                } else if (dtb.exec === undefined || dtb.exec === null || typeof dtb.exec != 'function') {
                    callback({
                        'message': `invalid dtb.exec | dtb.exec must be function, received ${typeof dtb.exec} ${JSON.stringify(dtb.exec)}`
                    });
                    resolve();
                } else if (dtb.run === undefined || dtb.run === null || typeof dtb.run != 'function') {
                    callback({
                        'message': `invalid dtb.run | dtb.run must be function, received ${typeof dtb.run} ${JSON.stringify(dtb.run)}`
                    });
                    resolve();
                } else if (dtb.all === undefined || dtb.all === null || typeof dtb.all != 'function') {
                    callback({
                        'message': `invalid dtb.all | dtb.all must be function, received ${typeof dtb.all} ${JSON.stringify(dtb.all)}`
                    });
                    resolve();

                    // args validation
                } else if (args === undefined || args === null || typeof args != 'object' || Object.keys(args).length == 0) {
                    try {
                        callback({
                            'message': `invalid args | args must be non-empty object, received ${typeof args} ${JSON.stringify(args)} with length ${Object.keys(args).length}`
                        });
                        resolve();
                    } catch (err) {
                        callback({
                            'message': `invalid args | args must be non-empty object, received ${typeof args} ${JSON.stringify(args)}`
                        });
                        resolve();
                    }

                    // args details
                } else if (args.email === undefined || args.email === null || typeof args.email != 'string') {
                    callback({
                        'message': `invalid args.email | args.email must be string, received '${args.email} ${typeof args.email}'`
                    });
                    resolve();
                } else if (args.password === undefined || args.password === null || typeof args.password != 'string' || args.password == '' || !isValidPassword(args.password)) {
                    callback({
                        'message': `invalid args.password | args.password must be 8 to 32 character string with lowercase, uppercase, number, and special chars, received '${args.password} ${typeof args.password}'`
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

                    bcrypt.hash(args.password, 16, (err, hash) => {
                        if (err) {
                            callback(err);
                            resolve();
                        } else {

                            dtb.run('UPDATE auth SET hash = ?, tempkey = NULL WHERE email = ? AND tempkey = ?;', [
                                hash,
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
    /* END TEMPKEY EMAIL METHODS */









}