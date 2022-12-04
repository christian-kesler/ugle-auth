/*
================================================================
ugle-auth
----------------
function parameters

    dtb - variable representing sqlite database connection
    args - object containing varying information necessary for each function
        create_fields - string containing the database fields to write to
        create_params - the values to be written into the database

        read_fields - string containing the database fields to retrieve
        read_param - variable containing the value to search for

        update_fields - 
        update_param - variable containing the value to search for

        delete_param - variable containing the value to search for

        retrieve_fields - 
        search_fields - string containing the database fields to search
        search_param - variable containing the value to search for
        update_param
        update_param
        email - 
        password - 
    callback - executed upon completion of the package function
        err - FALSE if successful, object if function failed
            message - descriptive string of what went wrong, taken from sqlite when possible
        data - object containing sqlite data if successful, NULL if function failed


callback(err, data)
    err will either be FALSE or contain a descriptive message at err.message
    data will either be NULL or contain the var retrieved from sqlite

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
/*
    Private Functions - END
*/


/*
    Public Functions - BEGIN
*/
module.exports = {
    /*
        functionName: (dtb, args, callback) => { } - BEGIN
    */
    /*
            CRUD user functions - BEGIN
    */
    createUser: (dtb, args, callback) => {
        // TODO
    },
    readUser: (dtb, args, callback) => {
        // TODO
    },
    updateUser: (dtb, args, callback) => {
        // TODO
    },
    deleteUser: (dtb, args, callback) => {
        // TODO
    },
    /*
            CRUD user functions - END
    */

    /*
            Authentication user functions - BEGIN
    */
    registerUser: (dtb, args, callback) => {
        // TODO
    },
    loginUser: (dtb, args, callback) => {
        // TODO
    },
    logoutUser: (dtb, args, callback) => {


        // TODO
    },
    /*
            Authentication user functions - END
    */
    /*
        functionName: (dtb, args, callback) => { } - END
    */


    /*
        functionName: (dtb, callback) => { } - BEGIN
    */
    allUsers: (dtb, callback) => {
        // TODO
    },
    /*
        functionName: (dtb, callback) => { }- END
    */
}
/*
    Public Functions - END
*/
