/*
================================================================
ugle-auth
----------------
callback parameters
    callback(err)
        createUser
        updateUser
        deleteUser

    callback(err, data)
        readUser
----------------
function parameters
    dtb - variable representing sqlite database connection
    args - object containing varying information necessary for each function
        create_fields - string containing the database fields to write to
            "email, hash, created_at, created_by"
        create_params - the values to be written into the database
            email - variable
            password - variable

        read_fields - string containing the database fields to retrieve
            "id, email, created_at, created_by"
        read_key - variable containing the field to index
            (id || email || created_at || created_by)
        read_value - variable containing the value to search for
            ${varies}

        update_fields - string containing the database fields to modify
            "email, hash"
        update_params - the values to be written into the database
            data - variable containing the actual content
            hash - boolean defining whether the data should be hashed before storing (PASSWORDS WILL NOT WORK UNLESS HASHED)
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
const crypto = require('crypto');
const fs = require('fs');
const sqlite3 = require(__dirname + '/../sqlite3')
/*
    Import Statements - END
*/


/*
    Private Functions - BEGIN
*/
async function tryCreateTable(dtb) {
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
}

function validEmail(input) {
    if (!containsQuotes(input) && input.includes('@') && input.includes('.') && input.length >= 5 && input.length <= 64) {
        return true
    } else {
        return false
    }
}
function validPassword(input) {
    if (!containsQuotes(input) && input.length >= 8 && input.length <= 32) {
        return true
    } else {
        return false
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
/*
    Private Functions - END
*/


/*
    Public Functions - BEGIN
*/
module.exports = {
    /*
        functionName: async (dtb, args, callback) => { } - BEGIN
    */
    /*
            CRUD user functions - BEGIN
    */
    createUser: async (dtb, args, callback) => {
        // TODO: testing
        await tryCreateTable(dtb)

        try {
            if (!validEmail(args.create_params.email)) {
                callback(
                    {
                        message: "invalid email"
                    }
                )
            } else {
                if (!validPassword(args.create_params.password)) {
                    callback(
                        {
                            message: "invalid password"
                        }
                    )
                } else {
                    await dtb.exec(`INSERT INTO auth(${args.create_fields}) VALUES(?, ?);`, [
                        args.create_params.email,
                        hash(args.create_params.password)
                    ], (err) => {
                        if (err) {
                            callback(
                                {
                                    message: err.message
                                }
                            )
                        } else {
                            callback(
                                false
                            )
                        }
                    })
                }
            }
        } catch (err) {
            callback(
                {
                    message: err.message
                }
            )
        }
    },
    readUser: async (dtb, args, callback) => {
        // TODO: testing
        await tryCreateTable(dtb)

        try {
            await dtb.all(`SELECT ${args.read_fields} FROM auth WHERE ${args.read_key} = ${args.read_value};`, [], (err, rows) => {
                if (err) {
                    callback(
                        {
                            message: err.message
                        },
                        null
                    )
                } else {
                    callback(
                        false
                    ),
                        rows
                }
            })
        } catch (err) {
            callback(
                {
                    message: err.message
                },
                null
            )
        }
    },
    updateUser: async (dtb, args, callback) => {
        // TODO: testing
        await tryCreateTable(dtb)

        try {
            if (args.update_params.hash == true) {
                args.update_params.data = hash(args.update_params.data)
            }
            await dtb.exec(`UPDATE auth SET ? = ? WHERE ? = ?;`, [
                args.update_field,
                args.update_params.data,
                args.update_key,
                args.update_value
            ], (err) => {
                if (err) {
                    callback(
                        {
                            message: err.message
                        }
                    )
                } else {
                    callback(
                        false
                    )
                }
            })
        } catch (err) {
            callback(
                {
                    message: err.message
                }
            )
        }
    },
    deleteUser: async (dtb, args, callback) => {
        // TODO: programming
    },
    /*
            CRUD user functions - END
    */

    /*
            Authentication user functions - BEGIN
    */
    registerUser: async (dtb, args, callback) => {
        // TODO: programming
    },
    loginUser: async (dtb, args, callback) => {
        // TODO: programming
    },
    logoutUser: async (dtb, args, callback) => {
        // TODO: programming
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
        // TODO: programming
    },
    /*
        functionName: async (dtb, callback) => { }- END
    */
}
/*
    Public Functions - END
*/
