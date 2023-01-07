// connectToDatabase, defaultPerms, lockoutPolicy




module.exports = {


    connectToDatabase: async (path, callback) => {
        return new Promise((resolve) => {
            try {

                const dtb = new sqlite3.Database(path, sqlite3.OPEN_READWRITE, (err) => {
                    if (err) {
                        callback(err);
                        resolve();
                    } else {
                        global.default_perms = {
                            'admin': false,
                            'user': true
                        }
                        global.lockout_policy = 4
                        global.login_redirect = '/account/home'
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


    defaultPerms: async (perms, callback) => {
        return new Promise((resolve) => {
            try {

                global.default_perms = perms
                callback(null)
                resolve()

            } catch (err) {
                try {
                    callback(err);
                    resolve();
                } catch (err) {
                    resolve();
                }
            }

        })
    },


    lockoutPolicy: async (attempts, callback) => {
        return new Promise((resolve) => {
            try {

                if (typeof Number(attempts) != 'number') {
                    callback(`arg1 must be number, received ${typeof Number(attempts)} ${attempts}`)
                    resolve()
                } else {
                    global.lockout_policy = Number(attempts)
                    resolve()
                }

            } catch (err) {
                try {
                    callback(err);
                    resolve();
                } catch (err) {
                    resolve();
                }
            }

        })
    },


    loginRedirect: async (url, callback) => {
        return new Promise((resolve) => {
            try {

                if (typeof url != 'string') {
                    callback(`arg1 must be string, received ${typeof url} ${url}`)
                    resolve()
                } else {
                    global.login_redirect = url
                    resolve()
                }

            } catch (err) {
                try {
                    callback(err);
                    resolve();
                } catch (err) {
                    resolve();
                }
            }

        })
    },

}