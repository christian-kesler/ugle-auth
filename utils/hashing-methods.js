// hash, tempkey




module.exports = {


    hash: (input) => {
        try {
            return pbkdf2Sync(input, process.env.AUTH_SALT, 999999, 255, 'sha512').toString('hex');
        } catch (err) {
            return null;
        }
    },


    tempkey: () => {
        try {
            return pbkdf2Sync(crypto.randomBytes(256).toString('hex'), crypto.randomBytes(256).toString('hex'), 999999, 255, 'sha512').toString('hex');
        } catch (err) {
            return null
        }
    }


}