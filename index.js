const crypto = require('crypto');
const fs = require('fs');
const sqlite3 = require('sqlite3')

async function initDatabase(database) {
    await database.exec(
        `CREATE TABLE IF NOT EXISTS auth(
        'email' VARCHAR(255) UNIQUE,
        'username' VARCHAR(255),
        'hash' VARCHAR(255),
        'tempkey' VARCHAR(255),
        'tempkey_datetime' DATE,

        'admin' INTEGER,
        'manager_tags' TEXT,
        'user_tags' TEXT,
        'nickname' VARCHAR(255),
        'pfp' VARCHAR(255),
        'theme' VARCHAR(255),
        'created_at' DATETIME,
        'updated_at' DATETIME,
        'deleted_at' DATETIME
        );`
    );
}

function isValidEmail(field) {
    if (field.includes('@') && field.includes('.') && field.length >= 5) {
        return true
    } else {
        return false
    }
}

function isTooShort(field) {
    if (field.length >= 8) {
        return false
    } else {
        return true
    }
}

function isTooLong(field) {
    if (field.length <= 32) {
        return false
    } else {
        return true
    }
}

function containsQuotes(field) {
    if (
        field.includes("'") ||
        field.includes('"') ||
        field.includes("`") ||
        field.includes("'") ||
        field.includes('"') ||
        field.includes("`") ||
        field.includes("'") ||
        field.includes('"') ||
        field.includes("`")
    ) {
        return true
    } else {
        return false
    }
}

function hash(input, salt) {
    return crypto.pbkdf2Sync(input, salt, 1000000, 255, `sha512`).toString(`hex`)
}

module.exports = {

    init: async function (path) {
        try {
            if (!fs.existsSync(path)) {
                fs.writeFileSync(path, '', () => {
                    console.log('new database file created. . . ')
                })
            }

            const database = new sqlite3.Database(path, sqlite3.OPEN_READWRITE, (err) => {
                if (err) console.log(err.message)
            })

            return database
        } catch (err) {
            console.log(err.message);

            return null
        }
    },

    register: async (database, req, salt) => {

        await initDatabase(database)

        return (async () => {
            // validating input
            console.log('validating input')

            return new Promise(async (resolve) => {

                data = {
                    email: req.body.email1,
                    username: req.body.username,
                    password: req.body.password1,
                }

                if (!containsQuotes(data.email) && !containsQuotes(data.username) && !containsQuotes(data.password)) {
                    if (isValidEmail(data.email)) {
                        if (!isTooLong(data.username)) {
                            if (!isTooShort(data.username)) {
                                if (!isTooLong(data.password)) {
                                    if (!isTooShort(data.password)) {
                                        resolve(data)
                                    } else {
                                        delete data
                                        resolve({
                                            'return': true,
                                            'valid': false,
                                            'code': 'password-too-short',
                                            'message': 'Password is too short (minimum 8 characters)'
                                        })
                                    }
                                } else {
                                    delete data
                                    resolve({
                                        'return': true,
                                        'valid': false,
                                        'code': 'password-too-long',
                                        'message': 'Password is too long (maximum 32 characters)'
                                    })
                                }
                            } else {
                                delete data
                                resolve({
                                    'return': true,
                                    'valid': false,
                                    'code': 'username-too-short',
                                    'message': 'Username is too short (minimum 8 characters)'
                                })
                            }
                        } else {
                            resolve({
                                'return': true,
                                'valid': false,
                                'code': 'username-too-long',
                                'message': 'Username is too long (maximum 32 characters)'
                            })
                        }
                    } else {
                        resolve({
                            'return': true,
                            'valid': false,
                            'code': 'email-is-invalid',
                            'message': 'Email is invalid (requires ampersand and period characters, and minimum 5 characters)'
                        })
                    }
                } else {
                    delete data
                    resolve({
                        'return': true,
                        'valid': false,
                        'code': 'input-contains-quotes',
                        'message': 'Quote characters are not allowed'
                    })
                }
            })
        })().then((data) => {
            if (data.return == true) {
                return data
            } else {
                // checking input originality
                console.log('checking input originality')

                return new Promise(async (resolve) => {

                    await database.all(`SELECT * FROM auth WHERE email LIKE '${data.email}' OR username LIKE '${data.username}'`, [], (err, rows) => {
                        if (err) { console.log(err.message) }
                        if (rows != undefined && rows.length > 0) {
                            for (let z = 0; z < rows.length; z++) {
                                if (data.email == rows[z].email) {
                                    z = rows.length

                                    delete data
                                    resolve({
                                        'return': true,
                                        'valid': false,
                                        'code': 'email-in-use',
                                        'message': 'That email is already in use'
                                    })
                                } else if (data.username == rows[z].username) {
                                    z = rows.length

                                    delete data
                                    resolve({
                                        'return': true,
                                        'valid': false,
                                        'code': 'username-in-use',
                                        'message': 'That username is already in use'
                                    })
                                } else {

                                    delete data
                                    resolve({
                                        'return': true,
                                        'valid': false,
                                        'code': 'database-code-error',
                                        'message': 'Database error: rows matching username or email were returned positive but no matches were found in the result'
                                    })
                                }
                            }
                        } else {
                            resolve(data)
                        }
                    })

                })
            }

        }).then((data) => {
            if (data.return == true) {
                return data
            } else {
                // creating database entry for new user
                console.log('creating database entry for new user')

                return new Promise(async (resolve) => {

                    await database.run("INSERT INTO auth(email, username, hash) VALUES(?, ?, ?);", [
                        data.email,
                        data.username,
                        hash(data.password, salt)
                    ], (err) => {
                        if (err) {
                            delete data;
                            console.log(err.message);
                        }
                    })

                    delete data
                    resolve({
                        'return': true,
                        'valid': true,
                        'code': 'registration-is-valid',
                        'message': 'Registration was successful'
                    })
                })
            }
        })
    },

    login: async (database, req, salt) => {

        await initDatabase(database)

        return (async () => {
            // validating input
            console.log('validating input')

            return new Promise(async (resolve) => {

                data = {
                    identifier: req.body.identifier,
                    hash: hash(req.body.password, salt),
                }

                if (!containsQuotes(data.identifier) && !containsQuotes(req.body.password)) {
                    if (!isTooLong(data.identifier)) {
                        if (!isTooShort(data.identifier)) {
                            if (!isTooLong(req.body.password)) {
                                if (!isTooShort(req.body.password)) {
                                    resolve(data)
                                } else {
                                    delete data
                                    resolve({
                                        'return': true,
                                        'valid': false,
                                        'code': 'password-too-short',
                                        'message': 'Password is too short (minimum 8 characters)'
                                    })
                                }
                            } else {
                                delete data
                                resolve({
                                    'return': true,
                                    'valid': false,
                                    'code': 'password-too-long',
                                    'message': 'Password is too long (maximum 32 characters)'
                                })
                            }
                        } else {
                            delete data
                            resolve({
                                'return': true,
                                'valid': false,
                                'code': 'identifier-too-short',
                                'message': 'Identifier is too short (minimum 8 characters)'
                            })
                        }
                    } else {
                        delete data
                        resolve({
                            'return': true,
                            'valid': false,
                            'code': 'identifier-too-long',
                            'message': 'Identifier is too long (maximum 32 characters)'
                        })
                    }
                } else {
                    delete data
                    resolve({
                        'return': true,
                        'valid': false,
                        'code': 'input-contains-quotes',
                        'message': 'Quote characters are not allowed'
                    })
                }
            })
        })().then((data) => {
            if (data.return == true) {
                return data
            } else {
                // comparing to database
                console.log('comparing to database')

                return new Promise(async (resolve) => {

                    await database.all(`SELECT * FROM auth WHERE email LIKE '${data.identifier}' OR username LIKE '${data.identifier}'`, [], (err, rows) => {
                        if (err) { console.log(err.message); return err }
                        if (rows != undefined && rows.length > 0) {
                            for (let z = 0; z < rows.length; z++) {
                                if (data.hash == rows[z].hash) {
                                    delete data
                                    resolve(rows[z])
                                } else {
                                    z = rows.length

                                    delete rows
                                    delete data
                                    resolve({
                                        'return': true,
                                        'valid': false,
                                        'code': 'credentials-not-present',
                                        'message': 'Those credentials did not match any existing records'
                                    })
                                }
                            }
                        } else {
                            delete rows
                            delete data
                            resolve({
                                'return': true,
                                'valid': false,
                                'code': 'credentials-not-present',
                                'message': 'Those credentials did not match any existing records'
                            })
                        }
                    })

                })
            }
        }).then((data) => {
            if (data.return == true) {
                return data
            } else {
                // creating session
                console.log('creating session')

                req.session.loggedin = true;
                req.session.email = data.email;
                req.session.username = data.username;
                req.session.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;

                delete data
                delete rows
                return {
                    'return': true,
                    'valid': true,
                    'code': 'login-was-successful',
                    'message': 'Login was successful'
                }
            }
        })
    },

    logout: async (req) => {

        req.session.destroy()

    },

    // set_tempkey: async (database, email, salt) => {

    //     await initDatabase(database)

    //     return (async () => {
    //         // validating input
    //         console.log('validating input')

    //         return new Promise((resolve) => {
    //             if (!isTooLong(email) && !isTooShort(email) && !containsQuotes(email) && isValidEmail(email)) {

    //             } else {
    //                 resolve({
    //                     'return': true,
    //                     'valid': false,
    //                     'code': 'email-is-invalid',
    //                     'message': 'That email does not pass input validation'
    //                 })
    //             }
    //         })
    //     })().then((data) => {
    //         if (data.return == true) {
    //             return data
    //         } else {
    //             // inserting tempkey
    //             console.log('inserting tempkey')

    //             return new Promise(async (resolve) => {
    //                 var hash = await hash(Math.random() * 1000000, salt)

    //                 database.all(
    //                     `UPDATE auth
    //                     SET tempkey = '${hash}'
    //                     WHERE email = '${email}';`,
    //                     [],
    //                     (err, rows) => {
    //                         if (err) { console.log(err.message); return err }
    //                         if (rows != undefined && rows.length == 1) {
    //                             if (email == rows[0].email) {
    //                                 resolve({
    //                                     'return': true,
    //                                     'valid': true,
    //                                     'code': 'tempkey-set-successfully',
    //                                     'message': 'Those credentials did not match any existing records'
    //                                 })
    //                             } else {
    //                                 delete rows
    //                                 resolve({
    //                                     'return': true,
    //                                     'valid': false,
    //                                     'code': 'credentials-not-present',
    //                                     'message': 'Those credentials did not match any existing records'
    //                                 })
    //                             }
    //                         } else {
    //                             delete rows
    //                             resolve({
    //                                 'return': true,
    //                                 'valid': false,
    //                                 'code': 'credentials-not-present',
    //                                 'message': 'Those credentials did not match any existing records'
    //                             })
    //                         }
    //                     }
    //                 )
    //             })

    //         }
    //     }).then((data) => {
    //         if (data.return == true) {
    //             return data
    //         } else {
    //             // sending email
    //             console.log('sending email')

    //             return new Promise(async (resolve) => {


    //             })
    //         }
    //     })

    // },
}