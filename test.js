const ugle_auth = require('./index.js');

const sqlite3 = require('sqlite3').verbose();
const dtb = new sqlite3.Database(':memory:');

(async () => {

    // const dtb = await new sqlite3.Database('./test.db', sqlite3.OPEN_READWRITE, (err) => {
    //     if (err) {
    //         console.log(err.message)
    //     } else {
    //         console.log('sqlite connection secured')
    //     }
    // });

    createUser_args = [
        {
            "create_fields": "email, hash, created_at, created_by",
            "create_params": {
                "email": "christian.j.kesler@gmail.com",
                "password": "examplePassword",
                "salt": "exampleSalt"
            }
        },
        {
            "create_fields": "hash, created_at, created_by",
            "create_params": {
                "email": "christian.j.kesler@gmail.com",
                "password": "examplePassword",
                "salt": "exampleSalt"
            }
        },
        {
            "create_fields": "email, created_at, created_by",
            "create_params": {
                "email": "christian.j.kesler@gmail.com",
                "password": "examplePassword",
                "salt": "exampleSalt"
            }
        },
        {
            "create_fields": "email, hash, created_by",
            "create_params": {
                "email": "christian.j.kesler@gmail.com",
                "password": "examplePassword",
                "salt": "exampleSalt"
            }
        },
        {
            "create_fields": "email, hash, created_at",
            "create_params": {
                "email": "christian.j.kesler@gmail.com",
                "password": "examplePassword",
                "salt": "exampleSalt"
            }
        },
        {
            "create_fields": "email, , , created_by",
            "create_params": {
                "email": "christian.j.kesler@gmail.com",
                "password": "examplePassword",
                "salt": "exampleSalt"
            }
        },
        {
            "create_fields": "email, hash, created_at, created_by",
            "create_params": {
                "password": "examplePassword",
                "salt": "exampleSalt"
            }
        },
        {
            "create_fields": "email, hash, created_at, created_by",
            "create_params": {
                "email": "christian.j.kesler@gmail.com",
                "salt": "exampleSalt"
            }
        },
        {
            "create_fields": "email, hash, created_at, created_by",
            "create_params": {
                "salt": "exampleSalt"
            }
        },
        {
            "create_fields": "email, hash, created_at, created_by",
        },
        {
            "create_params": {
                "email": "christian.j.kesler@gmail.com",
                "password": "examplePassword",
                "salt": "exampleSalt"
            }
        },
    ]
    for (i = 0; i < createUser_args.length; i++) {
        await ugle_auth.createUser(dtb, createUser_args[i], (err) => {
            if (err) {
                console.log(`FAIL | createUser[${i}] | ${err.message}`)
            } else {
                console.log(`PASS | createUser[${i}]`)
            }
        })
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
            console.log('[X] allUsers(nominal) failed: ' + err.message)
        } else {
            console.log('[X] allUsers(nominal) passed | ' + data)
        }
    })

})()
