/*
================================================================
ugle-auth
----------------
callback parameters
    callback(err)
        createUser
        deleteUser

    callback(err, data)
        readUser

    callback(err, data)
        updateUser

----------------
function parameters
    dtb - variable representing sqlite database connection
    args - object containing varying information necessary for each function
        create_fields - string containing the database fields to write to
            "email, hash, created_at, created_by"
        create_params - the values to be written into the database
            email - variable
            password - variable
            salt - variable

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
        session - the express-session to be modified 
         
    callback - executed upon completion of the package function
        err - FALSE if successful, object if function failed
            message - descriptive string of what went wrong, taken from sqlite when possible
        data - object containing sqlite data or session data if successful, NULL if function failed
================================================================
*/




/*
    Import Statements - BEGIN
*/
const { pbkdf2Sync } = require('crypto');
// const fs = require('fs');
// const sqlite3 = require(__dirname + '/../sqlite3')
const sqlite3 = require('sqlite3');

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

                'email' VARCHAR(255) UNIQUE,
                'hash' VARCHAR(255),
                'tempkey' VARCHAR(255),
                'tempkey_datetime' DATE,

                'created_at' DATETIME,
                'created_by' DATETIME,
                'deleted_at' DATETIME,
                'deleted_by' DATETIME
                );`
            );
            resolve()
        } catch (err) {
            // console.log(err.message);
            resolve()
        }
    })
}

function validEmail(input) {
    try {
        if (!containsQuotes(input) && input.includes('@') && input.includes('.') && input.length >= 5 && input.length <= 64) {
            return true;
        } else {
            // console.log('invalid email')
            return false;
        }
    } catch (err) {
        // console.log(err.message)
        return false;
    }
}
function validPassword(input) {
    try {
        if (!containsQuotes(input) && input.length >= 8 && input.length <= 32) {
            return true;
        } else {
            // console.log('invalid password')
            return false;
        }
    } catch (err) {
        // console.log(err.message)
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
            // console.log('input contains quotes')
            return true;
        } else {
            return false;
        }
    } catch (err) {
        // console.log(err.message)
        return true;
    }
}
function allValuesAreStrings(input) {

    if (typeof input === "object" && input !== null) {
        if (Object.keys(input).length === 0) {
            return false;
        } else {
            for (const key of Object.keys(input)) {
                if (!allValuesAreStrings(input[key])) {
                    return false;
                }
            }
        }
    } else if (typeof input !== "string" || input == null || typeof input == 'undefined') {
        return false;
    }

    return true;
}

function hash(input, salt) {
    try {
        return pbkdf2Sync(input, salt, 999999, 255, 'sha512').toString('hex');
    } catch (err) {
        // console.log(err.message);
        return null;
    }
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
    initDtb: async (path) => {
        try {
            return new Promise((resolve) => {


                const dtb = new sqlite3.Database(path, sqlite3.OPEN_READWRITE, (err) => {
                    if (err) {
                        // console.log(err.message);
                        resolve(err);
                    } else {
                        resolve(false, dtb);
                    }
                });


            });
        } catch (err) {
            // console.log(err.message);
            return (err);
        }
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

                if (!allValuesAreStrings(args)) {
                    callback({
                        message: 'non-string values detected'
                    });
                    resolve();
                } else {

                    if (args.create_fields === undefined ||
                        args.create_params === undefined ||
                        args.create_params.email === undefined ||
                        args.create_params.password === undefined ||
                        args.create_params.salt === undefined ||
                        args.create_params.created_at === undefined ||
                        args.create_params.created_by === undefined
                    ) {

                        callback({
                            message: 'missing args'
                        });
                        resolve();

                    } else {

                        if (!validEmail(args.create_params.email)) {
                            callback({
                                message: 'invalid email'
                            });
                            resolve();

                        } else {
                            if (!validPassword(args.create_params.password)) {
                                callback({
                                    message: 'invalid password'
                                });
                                resolve();

                            } else {

                                dtb.run(`INSERT INTO auth(${args.create_fields}) VALUES(?, ?, ?, ?);`, [args.create_params.email, hash(args.create_params.password, args.create_params.salt), args.create_params.created_at, args.create_params.created_by], (err) => {
                                    if (err) {

                                        callback({
                                            message: err.message
                                        });
                                        resolve();

                                    } else {

                                        callback(null);
                                        resolve();

                                    }
                                });
                            }
                        }
                    }
                }

            } catch (err) {
                callback({
                    message: 'CATCH ERROR ' + err.message
                });
                resolve();
            }
        });
    },
    readUser: async (dtb, args, callback) => {
        await tryCreateTable(dtb);

        return new Promise((resolve) => {
            try {

                tryCreateTable(dtb);

                if (!allValuesAreStrings(args)) {
                    callback({
                        message: 'non-string values detected'
                    });
                    resolve();
                } else {

                    if (args.read_fields === undefined ||
                        args.read_key === undefined ||
                        args.read_value === undefined
                    ) {

                        callback({
                            message: 'missing args'
                        });
                        resolve();

                    } else {

                        dtb.all(
                            `SELECT ${args.read_fields} FROM auth WHERE ${args.read_key} = ?;`,
                            [args.read_value],
                            (err, rows) => {
                                if (err) {

                                    callback({
                                        message: err.message
                                    });
                                    resolve();

                                } else if (rows.length == 0) {

                                    callback({
                                        message: 'entry not found'
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

                callback({
                    message: 'CATCH ERROR ' + err.message
                });
                resolve();

            }
        });
    },
    updateUser: async (dtb, args, callback) => {
        await tryCreateTable(dtb);

        return new Promise((resolve) => {
            try {

                if (!allValuesAreStrings(args)) {
                    callback({
                        message: 'non-string values detected'
                    });
                    resolve();
                } else {

                    if (args.update_field === undefined ||
                        args.update_params === undefined ||
                        args.update_params.data === undefined ||
                        args.update_key === undefined ||
                        args.update_value === undefined
                    ) {

                        callback({
                            message: 'missing args'
                        });
                        resolve();

                    } else {
                        if (args.update_field == 'hash') {
                            if (args.update_params.salt === undefined) {

                                callback({
                                    message: 'missing args'
                                });
                                resolve();

                            } else {

                                try {
                                    args.update_params.data = hash(args.update_params.data, args.update_params.salt);

                                    dtb.run(`UPDATE auth SET ${args.update_field} = ? WHERE ${args.update_key} = ?;`, [args.update_params.data, args.update_value], async function (err) {
                                        if (err) {

                                            callback({
                                                message: err.message,
                                            });
                                            resolve()
                                        } else if (this.changes == 0) {

                                            callback(
                                                {
                                                    message: `Row(s) affected: ${this.changes}`
                                                },
                                                {
                                                    count: this.changes,
                                                    message: `Row(s) affected: ${this.changes}`
                                                }
                                            );
                                            resolve()
                                        } else {

                                            callback(
                                                null,
                                                {
                                                    count: this.changes,
                                                    message: `Row(s) affected: ${this.changes}`
                                                }
                                            );
                                            resolve()
                                        }
                                    });

                                } catch (err) {

                                    callback({
                                        message: err.message
                                    });
                                    resolve()
                                }
                            }
                        } else {

                            dtb.run(`UPDATE auth SET ${args.update_field} = ? WHERE ${args.update_key} = ?;`, [args.update_params.data, args.update_value], async function (err) {
                                if (err) {

                                    callback({
                                        message: err.message,
                                    });
                                    resolve()
                                } else if (this.changes == 0) {

                                    callback(
                                        {
                                            message: `Row(s) affected: ${this.changes}`
                                        },
                                        {
                                            count: this.changes,
                                            message: `Row(s) affected: ${this.changes}`
                                        }
                                    );
                                    resolve()
                                } else {

                                    callback(
                                        null,
                                        {
                                            count: this.changes,
                                            message: `Row(s) affected: ${this.changes}`
                                        }
                                    );
                                    resolve()
                                }
                            });
                        }

                    }
                }
            } catch (err) {

                callback({
                    message: err.message
                });
                resolve()
            }
        })
    },
    deleteUser: async (dtb, args, callback) => {
        await tryCreateTable(dtb);

        return new Promise((resolve) => {
            try {
                if (!allValuesAreStrings(args)) {
                    callback({
                        message: 'non-string values detected'
                    });
                    resolve();
                } else {

                    if (args.delete_key === undefined ||
                        args.delete_value === undefined
                    ) {
                        callback({
                            message: 'missing args'
                        });
                        resolve();

                    } else {

                        dtb.run(`DELETE FROM auth WHERE ${args.delete_key} = ?;`, [args.delete_value], async function (err) {
                            if (err) {

                                callback({
                                    message: err.message,
                                });
                                resolve()
                            } else if (this.changes == 0) {

                                callback(
                                    {
                                        message: `Row(s) affected: ${this.changes}`
                                    },
                                    {
                                        count: this.changes,
                                        message: `Row(s) affected: ${this.changes}`
                                    }
                                );
                                resolve()
                            } else {

                                callback(
                                    null,
                                    {
                                        count: this.changes,
                                        message: `Row(s) affected: ${this.changes}`
                                    }
                                );
                                resolve()
                            }
                        });
                    }
                }
            } catch (err) {

                callback({
                    message: err.message
                });
                resolve()
            }
        })
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

                if (!allValuesAreStrings(args.login_params)) {
                    callback({
                        message: 'non-string values detected'
                    });
                    resolve();
                } else {

                    if (args.login_params === undefined ||
                        args.login_params.email === undefined ||
                        args.login_params.password === undefined ||
                        args.login_params.salt === undefined ||
                        args.session === undefined
                    ) {
                        callback({
                            message: 'missing args'
                        });
                        resolve();

                    } else {

                        if (!validEmail(args.login_params.email)) {
                            callback({
                                message: 'invalid email'
                            });
                            resolve()
                        } else {
                            if (!validPassword(args.login_params.password)) {
                                callback({
                                    message: 'invalid password'
                                });
                                resolve()
                            } else {
                                if (typeof args.session != 'object' || args.session == null || args.session == undefined || Array.isArray(args.session)) {
                                    callback({
                                        message: 'session must be object'
                                    });
                                    resolve()
                                } else {

                                    dtb.all(`SELECT * FROM auth WHERE email = ?;`, [
                                        args.login_params.email
                                    ], (err, rows) => {
                                        if (err) {
                                            callback({
                                                message: err.message
                                            });
                                            resolve()
                                        } else if (rows[0] == undefined) {
                                            callback({
                                                message: 'credentials failed'
                                            });
                                            resolve()
                                        } else {
                                            if (hash(args.login_params.password, args.login_params.salt) != rows[0].hash) {
                                                callback({
                                                    message: 'credentials failed'
                                                });
                                                resolve()
                                            } else {
                                                args.session.email = rows[0].email;
                                                args.session.id = rows[0].id;

                                                callback(null, args.session);
                                                resolve()
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
            } catch (err) {
                callback({
                    message: err.message
                });
                resolve()
            }
        })
    },
    logoutUser: async (args, callback) => {
        return new Promise((resolve) => {
            try {

                if (args.session === undefined) {
                    callback({
                        message: 'missing args'
                    });
                    resolve();

                } else {

                    if (typeof args.session != 'object' || Array.isArray(args.session) || args.session == null) {
                        callback({
                            message: 'session is not an object'
                        });
                        resolve()
                    } else {
                        for (const key in args.session) {
                            delete args.session[key];
                        }
                        // args.session.loggedIn = false

                        callback(null, args.session)
                        resolve()
                    }
                }

            } catch (err) {
                callback({
                    message: err.message
                });
                resolve()
            }
        })
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
                dtb.all('SELECT * FROM auth;', [], (err, rows) => {
                    if (err) {
                        callback({
                            message: err.message
                        });
                        resolve()
                    } else {
                        callback(null, rows);
                        resolve()
                    }
                });
            } catch (err) {
                callback({
                    message: err.message
                });
                resolve()
            }
        })
    },
    /*
        functionName: async (dtb, callback) => { }- END
    */
};
/*
    Public Functions - END
*/
