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
    callback - executed upon completion of the package function
        err - FALSE if successful, object if function failed
            message - descriptive string of what went wrong, taken from sqlite when possible
        data - object containing sqlite data if successful, NULL if function failed
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
    try {
        await dtb.exec(
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
    } catch (err) {
        console.log(err.message);
    }
}

function validEmail(input) {
    try {
        if (!containsQuotes(input) && input.includes('@') && input.includes('.') && input.length >= 5 && input.length <= 64) {
            return true;
        } else {
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
            return true;
        } else {
            return false;
        }
    } catch (err) {
        // console.log(err.message)
        return false;
    }
}

function hash(input, salt) {
    try {
        return pbkdf2Sync(input, salt, 999999, 255, 'sha512').toString('hex');
    } catch (err) {
        console.log(err.message);
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
                        console.log(err.message);
                        resolve(err);
                    } else {
                        resolve(false, dtb);
                    }
                });


            });
        } catch (err) {
            console.log(err.message);
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
    createUser: (dtb, args, callback) => {
        // Testing Completed
        return new Promise((resolve) => {
            try {

                tryCreateTable(dtb);

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
            } catch (err) {
                callback({
                    message: 'CATCH ERROR ' + err.message
                });
                resolve();

            }
        });
    },
    readUser: async (dtb, args, callback) => {
        // TODO: testing
        return new Promise((resolve) => {
            try {

                tryCreateTable(dtb);

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
            } catch (err) {

                callback({
                    message: 'CATCH ERROR ' + err.message
                });
                resolve();

            }
        });
    },
    updateUser: async (dtb, args, callback) => {
        // TODO: testing
        await tryCreateTable(dtb);

        try {
            if (args.update_params.salt != undefined) {
                try {
                    args.update_params.data = hash(args.update_params.data, args.update_params.salt);
                } catch (err) {

                    callback({
                        message: err.message
                    });

                }
            }

            await dtb.run(`UPDATE auth SET ${args.update_field} = ? WHERE ${args.update_key} = ?;`, [args.update_params.data, args.update_value], async function (err) {
                if (err) {

                    callback({
                        message: err.message,
                    });

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

                } else {

                    callback(
                        null,
                        {
                            count: this.changes,
                            message: `Row(s) affected: ${this.changes}`
                        }
                    );

                }
            });
        } catch (err) {

            callback({
                message: err.message
            });

        }
    },
    deleteUser: async (dtb, args, callback) => {
        // TODO: testing
        await tryCreateTable(dtb);

        try {
            await dtb.exec('DELETE FROM auth WHERE ? = ?;', [
                args.delete_key,
                args.delete_value,
            ], (err) => {
                if (err) {
                    callback({
                        message: err.message
                    });
                } else {
                    callback(null);
                }
            });
        } catch (err) {
            callback({
                message: err.message
            });
        }
    },
    /*
            CRUD user functions - END
    */


    /*
            Authentication user functions - BEGIN
    */
    loginUser: async (dtb, args, callback) => {
        // TODO: testing
        await tryCreateTable(dtb);

        try {
            if (!validEmail(args.login_params.email)) {
                callback({
                    message: 'invalid email'
                });
            } else {
                if (!validPassword(args.login_params.password)) {
                    callback({
                        message: 'invalid password'
                    });
                } else {
                    await dtb.all('SELECT * FROM auth WHERE ? = ?;', [
                        'email',
                        args.login_params.email
                    ], (err, rows) => {
                        if (err) {
                            callback({
                                message: err.message
                            });
                        } else {
                            if (hash(args.login_params.password, args.login_params.salt) != rows[0].hash) {
                                callback({
                                    message: 'credentials failed'
                                });
                            } else {
                                args.session.email = rows[0].email;
                                args.session.id = rows[0].id;

                                callback(null);
                            }
                        }
                    });
                }
            }
        } catch (err) {
            callback({
                message: err.message
            });
        }
    },
    logoutUser: async (dtb, args, callback) => {
        // TODO: programming

        try {
            args.session.destroy();
        } catch (err) {
            callback({
                message: err.message
            });
        }
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
        // TODO: testing
        await tryCreateTable(dtb);

        try {
            await dtb.all('SELECT * FROM auth;', [], (err, rows) => {
                if (err) {
                    callback({
                        message: err.message
                    });
                } else {
                    callback(null, rows);
                }
            });
        } catch (err) {
            callback({
                message: err.message
            });
        }

    },
    /*
        functionName: async (dtb, callback) => { }- END
    */
};
/*
    Public Functions - END
*/
