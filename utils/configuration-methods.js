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


    defaultPerms: async (perms) => {
        return new Promise((resolve) => {
            try {

                global.default_perms = perms
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
    }


}