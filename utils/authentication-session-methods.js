// login, logout, refreshSession, 




const { hash } = require(`${__dirname}/hashing-methods.js`)


module.exports = {


    login: async (dtb, args, callback) => {
        // await tryCreateTable(dtb);

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
                } else {

                    dtb.all('SELECT * FROM auth WHERE email = ?;', [
                        args.email
                    ], (err, rows) => {
                        if (err) {
                            callback(err);
                            resolve();
                        } else if (rows.length == 0) {
                            callback({
                                'message': 'Credentials failed'
                            });
                            resolve();
                        } else {

                            if (rows[0].failed_login_attempts >= 4) {
                                callback({
                                    'message': 'too many failed login attempts, contact your administrator to unlock your account'
                                });
                                resolve();
                            } else if (hash(args.password, process.env.AUTH_SALT) != rows[0].hash) {
                                dtb.run('UPDATE auth SET failed_login_attempts = ? WHERE email = ?;', [
                                    (rows[0].failed_login_attempts + 1),
                                    args.login_params.email
                                ], async function (err) {
                                    if (err) {
                                        callback({
                                            'message': `Credentials failed | ${err.message}`
                                        });
                                        resolve();
                                    } else if (this.changes == 0) {
                                        callback(
                                            {
                                                'message': `Credentials failed | Row(s) affected: ${this.changes}`
                                            }
                                        );
                                        resolve();
                                    } else {
                                        callback({
                                            'message': 'Credentials failed | login attempts incremented'
                                        });
                                        resolve();
                                    }
                                });
                            } else {
                                // args.session.email = rows[0].email;
                                // args.session.id = rows[0].id;
                                // args.session.perms = JSON.parse(rows[0].perms);
                                // args.session.valid = true;
                                // args.session.status = rows[0].status;

                                callback(null, {
                                    email: rows[0].email,
                                    id: rows[0].id,
                                    perms: JSON.parse(rows[0].perms),
                                    valid: true,
                                    status: rows[0].status,
                                });
                                resolve();
                            }
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


    logout: async (session, callback) => {
        return new Promise((resolve) => {
            try {

                if (session === undefined || session === null || typeof session != 'object') {
                    callback({
                        'message': `invalid session | session must be object, received '${session} ${typeof session}'`
                    });
                    resolve();
                } else {

                    session.valid = false;
                    session.email = null;
                    session.id = null;
                    session.perms = null;
                    session.status = null;

                    callback(null, session);
                    resolve();

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


    refreshSession: async (dtb, session, callback) => {
        return new Promise((resolve) => {
            try {

                if (session === undefined || session === null || typeof session != 'object') {
                    callback({
                        'message': `invalid session | session must be object, received '${session} ${typeof session}'`
                    });
                    resolve();
                } else {

                    dtb.all('SELECT * FROM auth WHERE email = ?;', [
                        session.email
                    ], (err, rows) => {
                        if (err) {
                            callback(err);
                            resolve();
                        } else if (rows.length == 0) {
                            callback({
                                'message': 'Credentials failed'
                            });
                            resolve();
                        } else {

                            callback(null, {
                                email: rows[0].email,
                                id: rows[0].id,
                                perms: JSON.parse(rows[0].perms),
                                valid: true,
                                status: rows[0].status,
                            });

                        }
                    })
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


}