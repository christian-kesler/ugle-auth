const ugle_auth = require('./index.js');

const sqlite3 = require('sqlite3').verbose();
// const dtb = new sqlite3.Database(':memory:');

(async () => {
    // TODO: convert to promise with .then to ensure dtb is loaded prior to other functions
    return new Promise((resolve) => {

        const dtb = new sqlite3.Database('./test.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.log(err.message);
                resolve(null);
            } else {
                console.log('sqlite connection secured');
                dtb.exec('DROP TABLE IF EXISTS auth;');
                resolve(dtb);
            }
        });
    });
})().then(async (dtb) => {

    var createUser_args = [
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'examplePassword',
                'salt': 'exampleSalt',
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'email': 'a@gmail',
                'password': 'examplePassword',
                'salt': 'exampleSalt',
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'hi',
                'salt': 'exampleSalt',
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'hash, created_at, created_by',
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'examplePassword',
                'salt': 'exampleSalt',
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by, deleted_by',
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'examplePassword',
                'salt': 'exampleSalt',
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, hello',
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'examplePassword',
                'salt': 'exampleSalt',
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, , , created_by',
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'examplePassword',
                'salt': 'exampleSalt',
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'password': 'examplePassword',
                'salt': 'exampleSalt',
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'salt': 'exampleSalt',
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'salt': 'exampleSalt',
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'salt': 'exampleSalt',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'salt': 'exampleSalt',
                'created_at': 'Today :)',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
        },
        {
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'examplePassword',
                'salt': 'exampleSalt',
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
    ];
    for (let i = 0; i < createUser_args.length; i++) {
        await ugle_auth.createUser(dtb, createUser_args[i], (err) => {
            if (err) {
                console.log(`FAIL | createUser[${i}] | ${err.message}`);
            } else {
                console.log(`PASS | createUser[${i}]`);
            }
        });
    }


    var readUser_args = [
        {
            'read_fields': 'id, email, created_at, created_by',
            'read_key': 'id',
            'read_value': '1',
        },
        {
            'read_fields': 'id, email, created_at, created_by',
            'read_key': 'id',
            'read_value': 'hero',
        },
        {
            'read_fields': 'id, email, created_at, created_by',
            'read_key': 'email',
            'read_value': 'christian.j.kesler@gmail.com',
        },
        {
            'read_fields': 'id, email, created_at, created_by',
            'read_key': 'email',
            'read_value': 'Antarctica',
        },
        {
            'read_fields': 'id, email, created_at, created_by',
            'read_key': 'created_at',
            'read_value': 'Today :)',
        },
        {
            'read_fields': 'id, email, created_at, created_by',
            'read_key': 'created_at',
            'read_value': 'Yesterday',
        },
        {
            'read_fields': 'id, email, created_at, created_by',
            'read_key': 'created_by',
            'read_value': 'Me',
        },
        {
            'read_fields': 'id, email, created_at, created_by',
            'read_key': 'created_by',
            'read_value': 'You',
        },
        {
            'read_fields': 'id, email, created_at, created_by',
            'read_value': 'You',
        },
        {
            'read_fields': 'id, email, created_at, created_by',
            'read_key': 'created_by',
        },
        {
            'read_key': 'created_by',
            'read_value': 'You',
        },
        {
            'read_value': 'You',
        },
        {
            'read_fields': 'id, email, created_at, created_by',
        },
        {
            'read_key': 'created_by',
        },
    ];
    for (let i = 0; i < readUser_args.length; i++) {
        await ugle_auth.readUser(dtb, readUser_args[i], (err, data) => {
            if (err) {
                console.log(`FAIL | readUser[${i}] | ${err.message}`);
            } else {
                console.log(`PASS | readUser[${i}] | ${JSON.stringify(data)}`);
            }
        });
    }
    // ugle_auth.readUser(dtb, args, (err) => {
    //     if (err) {
    //         console.log('[X] readUser(nominal) failed: ' + err.message)
    //     } else {
    //         console.log('[X] readUser(nominal) passed')
    //     }
    // })

    // ugle_auth.updateUser(dtb, args, (err) => {
    //     if (err) {
    //         console.log('[X] updateUser(nominal) failed: ' + err.message)
    //     } else {
    //         console.log('[X] updateUser(nominal) passed')
    //     }
    // })

    // ugle_auth.deleteUser(dtb, args, (err) => {
    //     if (err) {
    //         console.log('[X] deleteUser(nominal) failed: ' + err.message)
    //     } else {
    //         console.log('[X] deleteUser(nominal) passed')
    //     }
    // })

    // ugle_auth.loginUser(dtb, args, (err) => {
    //     if (err) {
    //         console.log('[X] loginUser(nominal) failed: ' + err.message)
    //     } else {
    //         console.log('[X] loginUser(nominal) passed')
    //     }
    // })

    // ugle_auth.logoutUser(dtb, args, (err) => {
    //     if (err) {
    //         console.log('[X] logoutUser(nominal) failed: ' + err.message)
    //     } else {
    //         console.log('[X] logoutUser(nominal) passed')
    //     }
    // })

    ugle_auth.allUsers(dtb, (err, data) => {
        if (err) {
            console.log('[X] allUsers(nominal) failed: ' + err.message);
        } else {
            console.log('[X] allUsers(nominal) passed | ' + JSON.stringify(data));
        }
    });

});
