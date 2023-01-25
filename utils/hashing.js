// hash, tempkey

const crypto = require('crypto');




module.exports = {

    hash: async (input) => {
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(input, process.env.AUTH_SALT, 999999, 255, 'sha512', (err, derivedKey) => {
                if (err) reject(err);
                resolve(derivedKey.toString('hex'));
            });
        });
    },

    tempkey: async () => {
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(crypto.randomBytes(256).toString('hex'), crypto.randomBytes(256).toString('hex'), 999999, 255, 'sha512', (err, derivedKey) => {
                if (err) reject(err);
                resolve(derivedKey.toString('hex'));
            });
        });
    }

}
