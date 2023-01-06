// create, read, update, delete, all, search




const { hash } = require(`${__dirname}/hashing-methods.js`)


module.exports = {


    createUser: async (dtb, args, callback) => {
        // var args = {
        //     'email': req.body.email,
        //     'password': req.body.password,
        //     'created_by': 'Self Signup',
        // };
        return new Promise((resolve) => {
            try {

                if (args === undefined || args === null || typeof args != 'object') {
                    callback({
                        'message': `invalid args | args must be object, received '${args} ${typeof args}'`
                    });
                    resolve();
                } else if (args.email === undefined || args.email === null || typeof args.email != 'string') {
                    callback({
                        'message': `invalid args.email | args.email must be string, received '${args.email} ${typeof args.email}'`
                    });
                    resolve();
                } else if (args.password === undefined || args.password === null || typeof args.password != 'string') {
                    callback({
                        'message': `invalid args.password | args.password must be string, received '${args.password} ${typeof args.password}'`
                    });
                    resolve();
                } else if (args.created_by === undefined || args.created_by === null || typeof args.created_by != 'string') {
                    callback({
                        'message': `invalid args.created_by | args.created_by must be string, received '${args.created_by} ${typeof args.created_by}'`
                    });
                    resolve();
                } else {

                    dtb.run('INSERT INTO auth(email, hash, perms, created_at, created_by, status) VALUES(?, ?, ?, ?, ?, ?);', [
                        args.email,
                        hash(args.password),
                        JSON.stringify(default_perms),
                        `${new Date}`,
                        args.created_by,
                        'unverified'
                    ], (err) => {
                        if (err) {
                            callback(err);
                            resolve();
                        } else {
                            callback(null);
                            resolve();
                        }
                    });
                }

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


    readUser: async (dtb, args, callback) => {
        await tryCreateTable(dtb);

        return new Promise((resolve) => {
            try {

                tryCreateTable(dtb);

                if (args.email === undefined) {
                    callback({
                        'message': 'missing args | args.email is undefined'
                    });
                    resolve();
                } else if (typeof args.email != 'string') {
                    callback({
                        'message': 'missing args | args.email is undefined'
                    });
                    resolve();


                } else {

                    dtb.all(
                        `SELECT id, status, email, perms, tempkey_datetime, failed_login_attempts, created_at, created_by FROM auth WHERE email = ?;`,
                        [args.email],
                        (err, rows) => {
                            if (err) {

                                callback(err);
                                resolve();

                            } else if (rows.length == 0) {

                                callback({
                                    'message': 'entry not found'
                                });
                                resolve();

                            } else {

                                callback(null, rows[0]);
                                resolve();

                            }
                        }
                    );
                }

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


    readUsers: async (dtb, args, callback) => {
        await tryCreateTable(dtb);

        return new Promise((resolve) => {
            try {

                tryCreateTable(dtb);

                if (args.email === undefined) {
                    callback({
                        'message': 'missing args | args.email is undefined'
                    });
                    resolve();
                } else if (typeof args.email != 'string') {
                    callback({
                        'message': 'missing args | args.email is undefined'
                    });
                    resolve();


                } else {

                    dtb.all(
                        `SELECT id, status, email, perms, tempkey_datetime, failed_login_attempts, created_at, created_by FROM auth WHERE email = ?;`,
                        [args.email],
                        (err, rows) => {
                            if (err) {

                                callback(err);
                                resolve();

                            } else if (rows.length == 0) {

                                callback({
                                    'message': 'entry not found'
                                });
                                resolve();

                            } else {

                                callback(null, rows);
                                resolve();

                            }
                        }
                    );
                }

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


    updateUser: async (dtb, args, callback) => {
        await tryCreateTable(dtb);

        return new Promise((resolve) => {
            try {

                if (!allValuesAreStringsOrBools(args)) {
                    callback({
                        'message': 'non-string values detected'
                    });
                    resolve();
                } else {

                    if (args.update_field === undefined) {
                        callback({
                            'message': 'missing args | update_field is undefined'
                        });
                        resolve();
                    } else if (args.update_params === undefined) {
                        callback({
                            'message': 'missing args | update_params is undefined'
                        });
                        resolve();
                    } else if (args.update_params.data === undefined) {
                        callback({
                            'message': 'missing args | update_params.data is undefined'
                        });
                        resolve();
                    } else if (args.email === undefined) {
                        callback({
                            'message': 'missing args | email is undefined'
                        });
                        resolve();
                    } else {

                        var execute = false;

                        if (args.update_field == 'status' || args.update_field == 'email' || args.update_field == 'perms' || args.update_field == 'tempkey_datetime' || args.update_field == 'failed_login_attempts') {
                            if (args.update_field == 'perms') {
                                if (typeof args.update_params.data != 'object') {

                                    callback({
                                        'message': 'missing args | perms must be object'
                                    });
                                    resolve();

                                } else {

                                    try {
                                        args.update_params.data = JSON.stringify(args.update_params.data);

                                        execute = true;
                                    } catch (err) {

                                        callback(err);
                                        resolve();
                                    }
                                }
                            } else {
                                execute = true;
                            }

                            if (execute) {
                                dtb.run(`UPDATE auth SET ${args.update_field} = ? WHERE email = ?;`, [args.update_params.data, args.email], async function (err) {
                                    if (err) {

                                        callback(err);
                                        resolve();
                                    } else if (this.changes == 0) {

                                        callback(
                                            {
                                                'message': `Row(s) affected: ${this.changes}`
                                            },
                                            {
                                                'count': this.changes,
                                                'message': `Row(s) affected: ${this.changes}`
                                            }
                                        );
                                        resolve();
                                    } else {

                                        if (args.update_field == 'hash') {
                                            dtb.run(`UPDATE auth SET failed_login_attempts = 0 WHERE email = ?;`, [args.email], async function (err) {
                                                if (err) {

                                                    callback(err);
                                                    resolve();
                                                } else if (this.changes == 0) {

                                                    callback(
                                                        {
                                                            'message': `Row(s) affected: ${this.changes}`
                                                        },
                                                        {
                                                            'count': this.changes,
                                                            'message': `Row(s) affected: ${this.changes}`
                                                        }
                                                    );
                                                    resolve();
                                                } else {

                                                    callback(
                                                        null,
                                                        {
                                                            'count': this.changes,
                                                            'message': `Row(s) affected: ${this.changes}`
                                                        }
                                                    );
                                                    resolve();
                                                }
                                            });
                                        } else {
                                            callback(
                                                null,
                                                {
                                                    'count': this.changes,
                                                    'message': `Row(s) affected: ${this.changes}`
                                                }
                                            );
                                            resolve();
                                        }
                                    }
                                });
                            }
                        } else {
                            callback({
                                'message': 'missing args | update_field is invalid'
                            });
                            resolve();
                        }
                    }
                }
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


    deleteUser: async (dtb, args, callback) => {
        await tryCreateTable(dtb);

        return new Promise((resolve) => {
            try {

                if (
                    args.email === undefined
                ) {
                    callback({
                        'message': 'missing args | email is undefined'
                    });
                    resolve();

                } else {

                    dtb.run(`DELETE FROM auth WHERE email = ?;`, [args.email], async function (err) {
                        if (err) {

                            callback(err);
                            resolve();
                        } else if (this.changes == 0) {

                            callback(
                                {
                                    'message': `Row(s) affected: ${this.changes}`
                                },
                                {
                                    'count': this.changes,
                                    'message': `Row(s) affected: ${this.changes}`
                                }
                            );
                            resolve();
                        } else {

                            callback(
                                null,
                                {
                                    'count': this.changes,
                                    'message': `Row(s) affected: ${this.changes}`
                                }
                            );
                            resolve();
                        }
                    });
                }

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


    allUsers: async (dtb, callback) => {
        await tryCreateTable(dtb);

        return new Promise((resolve) => {
            try {
                dtb.all('SELECT id, status, email, perms, tempkey_datetime, failed_login_attempts, created_at, created_by FROM auth;', [], (err, rows) => {
                    if (err) {
                        callback(err);
                        resolve();
                    } else {
                        callback(null, rows);
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


}