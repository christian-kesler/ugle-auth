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
        email - variable containing the value to search for
            ${varies}

        update_field - string containing the database fields to modify
            ("email", "hash")
        update_params - the values to be written into the database
            data - variable containing the actual content
            salt - string to salt the data with.  If undefined, plaintext is stored (PASSWORDS WILL NOT WORK UNLESS HASHED)
        email - variable containing the value to search for
            ${varies}

        delete_key - variable containing the field to index
            (id || email)
        email - variable containing the value to search for
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
            // SENSITIVE
            // hash, tempkey

            // CONVENTIONAL
            // id, status, email, perms, tempkey_datetime, failed_login_attempts, created_at, created_by
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

/*
    Private Functions - END
*/


/*
    Public Functions - BEGIN
*/
module.exports = {



};
/*
    Public Functions - END
*/
