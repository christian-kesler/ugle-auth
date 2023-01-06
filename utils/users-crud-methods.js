// create, read, update, delete, all, search




const { hash } = require(`${__dirname}/hashing-methods.js`)


module.exports = {


    createUser: async (dtb, args, callback) => {
        // Testing Completed
        await tryCreateTable(dtb);

        return new Promise((resolve) => {
            try {

                tryCreateTable(dtb);

                if (!allValuesAreStringsOrBools(args)) {
                    callback({
                        'message': 'non-string values detected'
                    });
                    resolve();
                } else if (args.create_params === undefined) {
                    callback({
                        'message': 'missing args | create_params is undefined'
                    });
                    resolve();
                } else if (args.create_params.email === undefined) {
                    callback({
                        'message': 'missing args | create_params.email is undefined'
                    });
                    resolve();
                } else if (args.create_params.password === undefined) {
                    callback({
                        'message': 'missing args | create_params.password is undefined'
                    });
                    resolve();
                } else if (args.create_params.salt === undefined) {
                    callback({
                        'message': 'missing args | create_params.salt is undefined'
                    });
                    resolve();
                } else if (args.create_params.perms === undefined) {
                    callback({
                        'message': 'missing args | create_params.perms is undefined'
                    });
                    resolve();
                } else if (args.create_params.created_at === undefined) {
                    callback({
                        'message': 'missing args | create_params.created_at is undefined'
                    });
                    resolve();
                } else if (args.create_params.created_by === undefined) {
                    callback({
                        'message': 'missing args | create_params.created_by is undefined'
                    });
                    resolve();

                } else if (!validEmail(args.create_params.email)) {
                    callback({
                        'message': 'invalid email'
                    });
                    resolve();

                } else if (!validPassword(args.create_params.password)) {
                    callback({
                        'message': 'invalid password'
                    });
                    resolve();

                } else if (typeof args.create_params.perms != 'object') {
                    callback({
                        'message': 'invalid perms'
                    });
                    resolve();

                } else {

                    dtb.run('INSERT INTO auth(email, hash, perms, created_at, created_by, status) VALUES(?, ?, ?, ?, ?, ?);', [
                        args.create_params.email,
                        hash(args.create_params.password, args.create_params.salt),
                        JSON.stringify(args.create_params.perms),
                        args.create_params.created_at,
                        args.create_params.created_by,
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