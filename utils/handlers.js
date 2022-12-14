/*
================================================================
ugle-auth
----------------
callback parameters
    callback(err)
        createUser
        deleteUser

    callback(err, data)
        readUser{s}

    callback(err, changes)
        updateUser

    callback(err, session)
        loginUser
        logoutUser

----------------
function parameters
    dtb - variable representing sqlite database connection
    args - object containing varying information necessary for each function
        create_params - the values to be written into the database
            email - variable
            password - variable
            salt - variable
            perms - object of booleans
            created_at - string of datetime
            created_by - string of creator email or other identifier

        read_fields - string containing the database fields to retrieve
            "id, email, created_at, created_by"
        read_key - variable containing the field to index
            (id || email || created_at || created_by)
        read_value - variable containing the value to search for
            ${varies}

        update_field - string containing the database fields to modify
            ("email", "hash")
        update_params - the values to be written into the database
            data - variable containing the actual content
            salt - string to salt the data with.  If undefined, plaintext is stored (PASSWORDS WILL NOT WORK UNLESS HASHED)
        update_key - variable containing the field to index
            (id || email)
        update_value - variable containing the value to search for
            ${varies}

        delete_key - variable containing the field to index
            (id || email)
        delete_value - variable containing the value to search for
            ${varies}

        login_params - the values to be compared to the database
            email - variable
            password - variable
            salt - variable
        session - the express-session object to be modified 
         
    callback - executed upon completion of the package function
        err - null if successful, object if function failed
            message - descriptive string of what went wrong, taken from sqlite when possible
        data - object containing sqlite data or session data if successful, null if function failed
================================================================
*/




/*
    Import Statements - BEGIN
*/
const { pbkdf2Sync } = require('crypto');
const sqlite3 = require('sqlite3');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
/*
    Import Statements - END
*/


/*
    Private Functions - BEGIN
*/
async function tryCreateTable(dtb) {
    return new Promise((resolve) => {
        try {
            dtb.exec(
                `CREATE TABLE IF NOT EXISTS auth(
                'id' INTEGER PRIMARY KEY AUTOINCREMENT,

                'status' VARCHAR(255),

                'email' VARCHAR(255) UNIQUE,
                'hash' VARCHAR(255),
                'perms' TEXT,

                'tempkey' VARCHAR(255),
                'tempkey_datetime' DATETIME,
                'failed_login_attempts' INTEGER,

                'created_at' DATETIME,
                'created_by' VARCHAR(255)
                );`
            );
            resolve();
        } catch (err) {
            resolve();
        }
    });
}

function validEmail(input) {
    try {
        if (!containsQuotes(input) && input.includes('@') && input.includes('.') && input.length >= 5 && input.length <= 64) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
}
function validPassword(input) {
    try {
        if (!containsQuotes(input) && input.length >= 8 && input.length <= 32) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
}
function containsQuotes(field) {
    try {
        if (
            field.includes('\'') ||
            field.includes('"') ||
            field.includes('`') ||
            field.includes('\'') ||
            field.includes('"') ||
            field.includes('`') ||
            field.includes('\'') ||
            field.includes('"') ||
            field.includes('`')
        ) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return true;
    }
}
function allValuesAreStringsOrBools(input) {

    if (typeof input === 'object' && input !== null) {
        if (Object.keys(input).length === 0) {
            return false;
        } else {
            for (const key of Object.keys(input)) {
                if (!allValuesAreStringsOrBools(input[key])) {
                    return false;
                }
            }
        }
    } else if (typeof input !== 'string' && typeof input !== 'boolean') {
        return false;
    }

    return true;

}

function hash(input, salt) {
    try {
        return pbkdf2Sync(input, salt, 999999, 255, 'sha512').toString('hex');
    } catch (err) {
        return null;
    }
}
function randomHash() {
    return hash(crypto.randomBytes(256).toString('hex'), crypto.randomBytes(256).toString('hex'));
}
/*
    Private Functions - END
*/


/*
    Public Functions - BEGIN
*/
module.exports = {
    /*
        Database Connection Function - BEGIN
    */
    initDtb: async (path, callback) => {
        return new Promise((resolve) => {
            try {

                const dtb = new sqlite3.Database(path, sqlite3.OPEN_READWRITE, (err) => {
                    if (err) {
                        callback(err);
                        resolve();
                    } else {
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
    /*
        Database Connection Function - END
    */




    /*
        functionName: async (dtb, args, callback) => { } - BEGIN
    */
    /*
            CRUD user functions - BEGIN
    */
    createUser: async (dtb, args, callback) => {
        // Testing Completed
        await tryCreateTable(dtb);

        return new Promise((resolve) => {
            try {

                tryCreateTable(dtb);

                if (!allValuesAreStringsOrBools(args)) {
                    callback({
                        'message': 'non-string values detected'
                    });
                    resolve();
                } else if (args.create_params === undefined) {
                    callback({
                        'message': 'missing args | create_params is undefined'
                    });
                    resolve();
                } else if (args.create_params.email === undefined) {
                    callback({
                        'message': 'missing args | create_params.email is undefined'
                    });
                    resolve();
                } else if (args.create_params.password === undefined) {
                    callback({
                        'message': 'missing args | create_params.password is undefined'
                    });
                    resolve();
                } else if (args.create_params.salt === undefined) {
                    callback({
                        'message': 'missing args | create_params.salt is undefined'
                    });
                    resolve();
                } else if (args.create_params.perms === undefined) {
                    callback({
                        'message': 'missing args | create_params.perms is undefined'
                    });
                    resolve();
                } else if (args.create_params.created_at === undefined) {
                    callback({
                        'message': 'missing args | create_params.created_at is undefined'
                    });
                    resolve();
                } else if (args.create_params.created_by === undefined) {
                    callback({
                        'message': 'missing args | create_params.created_by is undefined'
                    });
                    resolve();

                } else if (!validEmail(args.create_params.email)) {
                    callback({
                        'message': 'invalid email'
                    });
                    resolve();

                } else if (!validPassword(args.create_params.password)) {
                    callback({
                        'message': 'invalid password'
                    });
                    resolve();

                } else if (typeof args.create_params.perms != 'object') {
                    callback({
                        'message': 'invalid perms'
                    });
                    resolve();

                } else {

                    dtb.run('INSERT INTO auth(email, hash, perms, created_at, created_by, status) VALUES(?, ?, ?, ?, ?, ?);', [
                        args.create_params.email,
                        hash(args.create_params.password, args.create_params.salt),
                        JSON.stringify(args.create_params.perms),
                        args.create_params.created_at,
                        args.create_params.created_by,
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
    readUser: async (dtb, args, callback) => {
        await tryCreateTable(dtb);

        return new Promise((resolve) => {
            try {

                tryCreateTable(dtb);

                if (!allValuesAreStringsOrBools(args)) {
                    callback({
                        'message': 'non-string values detected'
                    });
                    resolve();
                } else {

                    if (args.read_fields === undefined) {
                        callback({
                            'message': 'missing args | read_fields is undefined'
                        });
                        resolve();
                    } else if (args.read_key === undefined) {
                        callback({
                            'message': 'missing args | read_key is undefined'
                        });
                        resolve();
                    } else if (args.read_value === undefined) {
                        callback({
                            'message': 'missing args | read_value is undefined'
                        });
                        resolve();

                    } else {

                        dtb.all(
                            `SELECT ${args.read_fields} FROM auth WHERE ${args.read_key} = ?;`,
                            [args.read_value],
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
    readUsers: async (dtb, args, callback) => {
        await tryCreateTable(dtb);

        return new Promise((resolve) => {
            try {

                tryCreateTable(dtb);

                if (!allValuesAreStringsOrBools(args)) {
                    callback({
                        'message': 'non-string values detected'
                    });
                    resolve();
                } else {

                    if (args.read_fields === undefined) {
                        callback({
                            'message': 'missing args | read_fields is undefined'
                        });
                        resolve();
                    } else if (args.read_key === undefined) {
                        callback({
                            'message': 'missing args | read_key is undefined'
                        });
                        resolve();
                    } else if (args.read_value === undefined) {
                        callback({
                            'message': 'missing args | read_value is undefined'
                        });
                        resolve();

                    } else {

                        dtb.all(
                            `SELECT ${args.read_fields} FROM auth WHERE ${args.read_key} = ?;`,
                            [args.read_value],
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
    updateUser: async (dtb, args, callback) => {
        await tryCreateTable(dtb);

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
                    } else if (args.update_key === undefined) {
                        callback({
                            'message': 'missing args | update_key is undefined'
                        });
                        resolve();
                    } else if (args.update_value === undefined) {
                        callback({
                            'message': 'missing args | update_value is undefined'
                        });
                        resolve();
                    } else {

                        var execute = false;

                        if (args.update_field == 'hash') {
                            if (args.update_params.salt === undefined) {

                                callback({
                                    'message': 'missing args | salt is undefined'
                                });
                                resolve();

                            } else {

                                try {
                                    args.update_params.data = hash(args.update_params.data, args.update_params.salt);

                                    execute = true;
                                } catch (err) {

                                    callback(err);
                                    resolve();
                                }
                            }
                        } else if (args.update_field == 'perms') {
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
                        } else if (args.update_field == 'tempkey') {
                            if (args.update_params.data != false && args.update_params.salt === undefined) {

                                callback({
                                    'message': 'missing args | salt is undefined'
                                });
                                resolve();

                            } else if (args.update_params.data == false) {
                                execute = true;
                            } else {
                                try {
                                    args.update_params.data = hash(args.update_params.data, args.update_params.salt);

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
                            dtb.run(`UPDATE auth SET ${args.update_field} = ? WHERE ${args.update_key} = ?;`, [args.update_params.data, args.update_value], async function (err) {
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
                                        dtb.run(`UPDATE auth SET failed_login_attempts = 0 WHERE ${args.update_key} = ?;`, [args.update_value], async function (err) {
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
    deleteUser: async (dtb, args, callback) => {
        await tryCreateTable(dtb);

        return new Promise((resolve) => {
            try {
                if (!allValuesAreStringsOrBools(args)) {
                    callback({
                        'message': 'non-string values detected'
                    });
                    resolve();
                } else {

                    if (
                        args.delete_key === undefined
                    ) {
                        callback({
                            'message': 'missing args | delete_key is undefined'
                        });
                        resolve();
                    } else if (
                        args.delete_value === undefined
                    ) {
                        callback({
                            'message': 'missing args | delete_value is undefined'
                        });
                        resolve();

                    } else {

                        dtb.run(`DELETE FROM auth WHERE ${args.delete_key} = ?;`, [args.delete_value], async function (err) {
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
    /*
            CRUD user functions - END
    */


    /*
            Authentication user functions - BEGIN
    */
    loginUser: async (dtb, args, callback) => {
        await tryCreateTable(dtb);

        return new Promise((resolve) => {
            try {

                if (!allValuesAreStringsOrBools(args.login_params)) {
                    callback({
                        'message': 'non-string values detected'
                    });
                    resolve();
                } else {

                    if (args.login_params === undefined) {
                        callback({
                            'message': 'missing args | login_params is undefined'
                        });
                        resolve();
                    } else if (args.login_params.email === undefined) {
                        callback({
                            'message': 'missing args | login_params.email is undefined'
                        });
                        resolve();
                    } else if (args.login_params.password === undefined) {
                        callback({
                            'message': 'missing args | login_params.password is undefined'
                        });
                        resolve();
                    } else if (args.login_params.salt === undefined) {
                        callback({
                            'message': 'missing args | login_params.salt is undefined'
                        });
                        resolve();
                    } else if (args.session === undefined) {
                        callback({
                            'message': 'missing args | session is undefined'
                        });
                        resolve();

                    } else {

                        if (!validEmail(args.login_params.email)) {
                            callback({
                                'message': 'invalid email'
                            });
                            resolve();
                        } else {
                            if (!validPassword(args.login_params.password)) {
                                callback({
                                    'message': 'invalid password'
                                });
                                resolve();
                            } else {
                                if (typeof args.session != 'object' || args.session == null || args.session == undefined || Array.isArray(args.session)) {
                                    callback({
                                        'message': 'session must be object'
                                    });
                                    resolve();
                                } else {

                                    dtb.all('SELECT * FROM auth WHERE email = ?;', [
                                        args.login_params.email
                                    ], (err, rows) => {
                                        if (err) {
                                            callback(err);
                                            resolve();
                                        } else if (rows[0] == undefined) {
                                            callback({
                                                'message': 'Credentials failed'
                                            });
                                            resolve();
                                        } else {
                                            if (rows[0].failed_login_attempts >= 4) {

                                                callback({
                                                    'message': 'too many failed login attempts, contact your administrator to unlock your account'
                                                });
                                                resolve();
                                            } else if (hash(args.login_params.password, args.login_params.salt) != rows[0].hash) {
                                                dtb.run('UPDATE auth SET failed_login_attempts = ? WHERE email = ?;', [(rows[0].failed_login_attempts + 1), args.login_params.email], async function (err) {
                                                    if (err) {

                                                        callback({
                                                            'message': `Credentials failed | ${err.message}`
                                                        });
                                                        resolve();
                                                    } else if (this.changes == 0) {

                                                        callback(
                                                            {
                                                                'message': `Credentials failed | Row(s) affected: ${this.changes}`
                                                            },
                                                            {
                                                                'count': this.changes,
                                                                'message': `Row(s) affected: ${this.changes}`
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
                                                args.session.email = rows[0].email;
                                                args.session.id = rows[0].id;
                                                args.session.perms = JSON.parse(rows[0].perms);
                                                args.session.valid = true;
                                                args.session.status = rows[0].status;

                                                callback(null, args.session);
                                                resolve();
                                            }
                                        }
                                    });
                                }
                            }
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
    logoutUser: async (args, callback) => {
        return new Promise((resolve) => {
            try {

                if (args.session === undefined) {
                    callback({
                        'message': 'missing args | session is undefined'
                    });
                    resolve();

                } else {

                    if (typeof args.session != 'object' || Array.isArray(args.session) || args.session == null) {
                        callback({
                            'message': 'session is not an object'
                        });
                        resolve();
                    } else {
                        args.session.email = null;
                        args.session.id = null;
                        args.session.perms = null;
                        args.session.valid = false;

                        callback(null, args.session);
                        resolve();
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
    /*
            Authentication user functions - END
    */
    /*
        functionName: async (dtb, args, callback) => { } - END
    */


    /*
        functionName: async (dtb, callback) => { } - BEGIN
    */
    allUsers: async (dtb, callback) => {
        await tryCreateTable(dtb);

        return new Promise((resolve) => {
            try {
                dtb.all('SELECT id, status, email, perms, tempkey, tempkey_datetime, failed_login_attempts, created_at, created_by FROM auth;', [], (err, rows) => {
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
    /*
        functionName: async (dtb, callback) => { }- END
    */






    // tempkey functions - manual testing only 
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
                        randomHash(),
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

};
/*
    Public Functions - END
*/
