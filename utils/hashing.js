// hash, tempkey

const crypto = require('crypto');




module.exports = {


    hash: (input) => {
        return crypto.pbkdf2Sync(input, process.env.AUTH_SALT, 999999, 255, 'sha512').toString('hex');
    },


    tempkey: () => {
        return crypto.pbkdf2Sync(crypto.randomBytes(256).toString('hex'), crypto.randomBytes(256).toString('hex'), 999999, 255, 'sha512').toString('hex');
    }


}