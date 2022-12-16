const ugle_auth = require('./index.js');

const sqlite3 = require('sqlite3').verbose();
// const dtb = new sqlite3.Database(':memory:');

// valid strings
// invalid strings
// integers
// objects
// arrays
// null
// undefined
// absent
(async () => {
    // TODO: convert to promise with .then to ensure dtb is loaded prior to other functions
    return new Promise((resolve) => {

        const dtb = new sqlite3.Database('./test.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.log(`[ ] FAIL | new sqlite3.Database | ${err.message}`);
                resolve(null);
            } else {
                console.log(`[X] PASS | new sqlite3.Database`);
                dtb.exec('DROP TABLE IF EXISTS auth;');
                resolve(dtb);
            }
        });
    });
})().then(async (dtb) => {


    var createUser_args = [
        // valid strings
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'email': 'uglesoft@gmail.com',
                'password': 'uglesoftPassword',
                'salt': 'uglesoftSalt',
                'created_at': 'This Exact Moment',
                'created_by': 'The Supreme Owl Tester',
            }
        },
        // invalid strings
        {
            'create_fields': 'email, hash, created_at',
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'email': 'c@gmail',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'pass',
                'salt': 'personalSalt',
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': 'args_obj'
        },
        // integers
        {
            'create_fields': 8,
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'email': 8,
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 8,
                'salt': 'personalSalt',
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 8,
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'created_at': 8,
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'created_at': 'Today :)',
                'created_by': 8,
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': 8
        },
        // objects
        {
            'create_fields': {},
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'email': {},
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': {},
                'salt': 'personalSalt',
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': {},
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'created_at': {},
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'created_at': 'Today :)',
                'created_by': {},
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {}
        },
        // arrays
        {
            'create_fields': [],
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'email': [],
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': [],
                'salt': 'personalSalt',
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': [],
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'created_at': [],
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'created_at': 'Today :)',
                'created_by': [],
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': []
        },
        // null
        {
            'create_fields': null,
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'email': null,
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': null,
                'salt': 'personalSalt',
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': null,
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'created_at': null,
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'created_at': 'Today :)',
                'created_by': null,
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': null
        },
        // undefined
        {
            'create_fields': undefined,
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'email': undefined,
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': undefined,
                'salt': 'personalSalt',
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': undefined,
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'created_at': undefined,
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'created_at': 'Today :)',
                'created_by': undefined,
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': undefined,
        },
        // absent
        {
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'salt': 'personalSalt',
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'created_by': 'Me',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'created_at': 'Today :)',
            }
        },
        {
            'create_fields': 'email, hash, created_at, created_by',
        },
    ];
    for (let i = 0; i < createUser_args.length; i++) {
        await ugle_auth.createUser(dtb, createUser_args[i], (err) => {
            if (i <= 1) {
                if (err) {
                    console.log(`[ ] FAIL | createUser[${i}] | ${err.message}`);
                } else {
                    console.log(`[X] PASS | createUser[${i}]`);
                }
            } else {
                if (err) {
                    console.log(`[X] FAIL | createUser[${i}] | ${err.message}`);
                } else {
                    console.log(`[ ] PASS | createUser[${i}]`);
                }
            }
        });
    }


    await ugle_auth.allUsers(dtb, (err, data) => {
        if (err) {
            console.log('[ ] allUsers(nominal) failed: ' + err.message);
        } else {
            console.log('================================================================')
            console.log('[X] allUsers(nominal) passed | ' + JSON.stringify(data));
            console.log('================================================================')
        }
    });


    var readUser_args = [
        // valid strings
        {
            'read_fields': 'id, email, created_at, created_by',
            'read_key': 'id',
            'read_value': '2',
        },
        {
            'read_fields': 'id, email, created_at, created_by',
            'read_key': 'email',
            'read_value': 'christian.j.kesler@gmail.com',
        },
        // invalid strings
        {
            'read_fields': 'fake',
            'read_key': 'email',
            'read_value': 'christian.j.kesler@gmail.com',
        },
        {
            'read_fields': 'id, email, created_at, created_by',
            'read_key': 'fake',
            'read_value': 'christian.j.kesler@gmail.com',
        },
        {
            'read_fields': 'id, email, created_at, created_by',
            'read_key': 'email',
            'read_value': 'fake',
        },
        // integers
        {
            'read_fields': 8,
            'read_key': 'email',
            'read_value': 'christian.j.kesler@gmail.com',
        },
        {
            'read_fields': 'id, email, created_at, created_by',
            'read_key': 8,
            'read_value': 'christian.j.kesler@gmail.com',
        },
        {
            'read_fields': 'id, email, created_at, created_by',
            'read_key': 'email',
            'read_value': 8,
        },
        // objects
        {
            'read_fields': {},
            'read_key': 'email',
            'read_value': 'christian.j.kesler@gmail.com',
        },
        {
            'read_fields': 'id, email, created_at, created_by',
            'read_key': {},
            'read_value': 'christian.j.kesler@gmail.com',
        },
        {
            'read_fields': 'id, email, created_at, created_by',
            'read_key': 'email',
            'read_value': {},
        },
        // arrays
        {
            'read_fields': [],
            'read_key': 'email',
            'read_value': 'christian.j.kesler@gmail.com',
        },
        {
            'read_fields': 'id, email, created_at, created_by',
            'read_key': [],
            'read_value': 'christian.j.kesler@gmail.com',
        },
        {
            'read_fields': 'id, email, created_at, created_by',
            'read_key': 'email',
            'read_value': [],
        },
        // null
        {
            'read_fields': null,
            'read_key': 'email',
            'read_value': 'christian.j.kesler@gmail.com',
        },
        {
            'read_fields': 'id, email, created_at, created_by',
            'read_key': null,
            'read_value': 'christian.j.kesler@gmail.com',
        },
        {
            'read_fields': 'id, email, created_at, created_by',
            'read_key': 'email',
            'read_value': null,
        },
        // undefined
        {
            'read_fields': undefined,
            'read_key': 'email',
            'read_value': 'christian.j.kesler@gmail.com',
        },
        {
            'read_fields': 'id, email, created_at, created_by',
            'read_key': undefined,
            'read_value': 'christian.j.kesler@gmail.com',
        },
        {
            'read_fields': 'id, email, created_at, created_by',
            'read_key': 'email',
            'read_value': undefined,
        },
        // absent
        {
            'read_key': 'email',
            'read_value': 'christian.j.kesler@gmail.com',
        },
        {
            'read_fields': 'id, email, created_at, created_by',
            'read_value': 'christian.j.kesler@gmail.com',
        },
        {
            'read_fields': 'id, email, created_at, created_by',
            'read_key': 'email',
        },
    ];
    for (let i = 0; i < readUser_args.length; i++) {
        await ugle_auth.readUser(dtb, readUser_args[i], (err, data) => {
            if (i <= 1) {
                if (err) {
                    console.log(`[ ] FAIL | readUser[${i}] | ${err.message}`);
                } else {
                    console.log(`[X] PASS | readUser[${i}] | ${JSON.stringify(data)}`);
                }
            } else {
                if (err) {
                    console.log(`[X] FAIL | readUser[${i}] | ${err.message}`);
                } else {
                    console.log(`[ ] PASS | readUser[${i}] | ${JSON.stringify(data)}`);
                }
            }
        });
    }


    await ugle_auth.allUsers(dtb, (err, data) => {
        if (err) {
            console.log('[ ] allUsers(nominal) failed: ' + err.message);
        } else {
            console.log('================================================================')
            console.log('[X] allUsers(nominal) passed | ' + JSON.stringify(data));
            console.log('================================================================')
        }
    });


    var updateUser_args = [
        // valid strings
        {
            'update_field': 'hash',
            'update_params': {
                'data': 'new_password',
                'salt': 'exampleSalt',
            },
            'update_key': 'email',
            'update_value': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'created_by',
            'update_params': {
                'data': 'A Cool Test Script',
            },
            'update_key': 'email',
            'update_value': 'christian.j.kesler@gmail.com'
        },
        // invalid strings
        {
            'update_field': 'fake',
            'update_params': {
                'data': 'A Cool Test Script',
            },
            'update_key': 'email',
            'update_value': 'christian.j.kesler@gmail.com'
        },
        {
            'update_field': 'created_by',
            'update_params': {
                'data': 'A Cool Test Script',
            },
            'update_key': 'fake',
            'update_value': 'christian.j.kesler@gmail.com'
        },
        {
            'update_field': 'created_by',
            'update_params': {
                'data': 'A Cool Test Script',
            },
            'update_key': 'email',
            'update_value': 'fake'
        },
        // integers
        {
            'update_field': 8,
            'update_params': {
                'data': 'new_password',
                'salt': 'exampleSalt',
            },
            'update_key': 'email',
            'update_value': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': 8,
                'salt': 'exampleSalt',
            },
            'update_key': 'email',
            'update_value': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': 'new_password',
                'salt': 8,
            },
            'update_key': 'email',
            'update_value': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'created_by',
            'update_params': {
                'data': 8,
                'salt': 'exampleSalt',
            },
            'update_key': 'email',
            'update_value': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'created_by',
            'update_params': {
                'data': 'new_password',
                'salt': 8,
            },
            'update_key': 'email',
            'update_value': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': 'new_password',
                'salt': 'exampleSalt',
            },
            'update_key': 8,
            'update_value': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': 'new_password',
                'salt': 'exampleSalt',
            },
            'update_key': 'email',
            'update_value': 8
        },
        // objects
        {
            'update_field': {},
            'update_params': {
                'data': 'new_password',
                'salt': 'exampleSalt',
            },
            'update_key': 'email',
            'update_value': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': {},
                'salt': 'exampleSalt',
            },
            'update_key': 'email',
            'update_value': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': 'new_password',
                'salt': {},
            },
            'update_key': 'email',
            'update_value': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'created_by',
            'update_params': {
                'data': {},
                'salt': 'exampleSalt',
            },
            'update_key': 'email',
            'update_value': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'created_by',
            'update_params': {
                'data': 'new_password',
                'salt': {},
            },
            'update_key': 'email',
            'update_value': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': 'new_password',
                'salt': 'exampleSalt',
            },
            'update_key': {},
            'update_value': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': 'new_password',
                'salt': 'exampleSalt',
            },
            'update_key': 'email',
            'update_value': {}
        },

        // arrays
        {
            'update_field': [],
            'update_params': {
                'data': 'new_password',
                'salt': 'exampleSalt',
            },
            'update_key': 'email',
            'update_value': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': [],
                'salt': 'exampleSalt',
            },
            'update_key': 'email',
            'update_value': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': 'new_password',
                'salt': [],
            },
            'update_key': 'email',
            'update_value': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'created_by',
            'update_params': {
                'data': [],
                'salt': 'exampleSalt',
            },
            'update_key': 'email',
            'update_value': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'created_by',
            'update_params': {
                'data': 'new_password',
                'salt': [],
            },
            'update_key': 'email',
            'update_value': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': 'new_password',
                'salt': 'exampleSalt',
            },
            'update_key': [],
            'update_value': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': 'new_password',
                'salt': 'exampleSalt',
            },
            'update_key': 'email',
            'update_value': []
        },

        // null
        {
            'update_field': null,
            'update_params': {
                'data': 'new_password',
                'salt': 'exampleSalt',
            },
            'update_key': 'email',
            'update_value': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': null,
                'salt': 'exampleSalt',
            },
            'update_key': 'email',
            'update_value': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': 'new_password',
                'salt': null,
            },
            'update_key': 'email',
            'update_value': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'created_by',
            'update_params': {
                'data': null,
                'salt': 'exampleSalt',
            },
            'update_key': 'email',
            'update_value': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'created_by',
            'update_params': {
                'data': 'new_password',
                'salt': null,
            },
            'update_key': 'email',
            'update_value': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': 'new_password',
                'salt': 'exampleSalt',
            },
            'update_key': null,
            'update_value': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': 'new_password',
                'salt': 'exampleSalt',
            },
            'update_key': 'email',
            'update_value': null
        },

        // undefined
        {
            'update_field': undefined,
            'update_params': {
                'data': 'new_password',
                'salt': 'exampleSalt',
            },
            'update_key': 'email',
            'update_value': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': undefined,
                'salt': 'exampleSalt',
            },
            'update_key': 'email',
            'update_value': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': 'new_password',
                'salt': undefined,
            },
            'update_key': 'email',
            'update_value': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'created_by',
            'update_params': {
                'data': undefined,
                'salt': 'exampleSalt',
            },
            'update_key': 'email',
            'update_value': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'created_by',
            'update_params': {
                'data': 'new_password',
                'salt': undefined,
            },
            'update_key': 'email',
            'update_value': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': 'new_password',
                'salt': 'exampleSalt',
            },
            'update_key': undefined,
            'update_value': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': 'new_password',
                'salt': 'exampleSalt',
            },
            'update_key': 'email',
            'update_value': undefined
        },

        // absent
        {
            'update_params': {
                'data': 'new_password',
                'salt': 'exampleSalt',
            },
            'update_key': 'email',
            'update_value': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'salt': 'exampleSalt',
            },
            'update_key': 'email',
            'update_value': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': 'new_password',
            },
            'update_key': 'email',
            'update_value': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'created_by',
            'update_params': {
                'salt': 'exampleSalt',
            },
            'update_key': 'email',
            'update_value': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'created_by',
            'update_params': {
                'data': 'new_password',
            },
            'update_key': 'email',
            'update_value': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': 'new_password',
                'salt': 'exampleSalt',
            },
            'update_value': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': 'new_password',
                'salt': 'exampleSalt',
            },
            'update_key': 'email',
        },
    ];
    for (let i = 0; i < updateUser_args.length; i++) {
        await ugle_auth.updateUser(dtb, updateUser_args[i], (err, changes) => {
            if (i <= 1) {
                if (err) {
                    console.log(`[ ] FAIL | updateUser[${i}] | ${err.message}`);
                } else {
                    console.log(`[X] PASS | updateUser[${i}] | ${changes.message}`);
                }
            } else {
                if (err) {
                    console.log(`[X] FAIL | updateUser[${i}] | ${err.message}`);
                } else {
                    console.log(`[ ] PASS | updateUser[${i}] | ${changes.message}`);
                }
            }
        });
    }


    await ugle_auth.allUsers(dtb, (err, data) => {
        if (err) {
            console.log('[ ] allUsers(nominal) failed: ' + err.message);
        } else {
            console.log('================================================================')
            console.log('[X] allUsers(nominal) passed | ' + JSON.stringify(data));
            console.log('================================================================')
        }
    });


    global.session = {}
    console.log(`SESSION | ${JSON.stringify(session)}`);


    var loginUser_args = [
        // valid strings
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'uglesoft@gmail.com',
                'password': 'uglesoftPassword',
                'salt': 'uglesoftSalt',
            },
            'session': session
        },
        // invalid strings
        {
            'login_params': {
                'email': 'fake@gmail',
                'password': 'personalPassword',
                'salt': 'personalSalt',
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'fake',
                'salt': 'personalSalt',
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'fake',
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
            },
            'session': 'fake'
        },
        // integers
        {
            'login_params': 8,
            'session': session
        },
        {
            'login_params': {
                'email': 8,
                'password': 'personalPassword',
                'salt': 'personalSalt',
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 8,
                'salt': 'personalSalt',
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 8,
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
            },
            'session': 8
        },
        // objects
        {
            'login_params': {},
            'session': session
        },
        {
            'login_params': {
                'email': {},
                'password': 'personalPassword',
                'salt': 'personalSalt',
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': {},
                'salt': 'personalSalt',
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': {},
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
            },
            'session': {}
        },
        // arrays
        {
            'login_params': [],
            'session': session
        },
        {
            'login_params': {
                'email': [],
                'password': 'personalPassword',
                'salt': 'personalSalt',
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': [],
                'salt': 'personalSalt',
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': [],
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
            },
            'session': []
        },
        // null
        {
            'login_params': null,
            'session': session
        },
        {
            'login_params': {
                'email': null,
                'password': 'personalPassword',
                'salt': 'personalSalt',
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': null,
                'salt': 'personalSalt',
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': null,
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
            },
            'session': null
        },
        // undefined
        {
            'login_params': undefined,
            'session': session
        },
        {
            'login_params': {
                'email': undefined,
                'password': 'personalPassword',
                'salt': 'personalSalt',
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': undefined,
                'salt': 'personalSalt',
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': undefined,
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
            },
            'session': undefined
        },
        // absent
        {
            'session': session
        },
        {
            'login_params': {
                'password': 'personalPassword',
                'salt': 'personalSalt',
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'salt': 'personalSalt',
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
            },
        },
    ];
    for (let i = 0; i < loginUser_args.length; i++) {
        await ugle_auth.loginUser(dtb, loginUser_args[i], (err) => {
            if (i <= 1) {
                if (err) {
                    console.log(`[ ] FAIL | loginUser[${i}] | ${err.message}`);
                } else {
                    console.log(`[X] PASS | loginUser[${i}] | ${JSON.stringify(session)}`);
                }
            } else {
                if (err) {
                    console.log(`[X] FAIL | loginUser[${i}] | ${err.message}`);
                } else {
                    console.log(`[ ] PASS | loginUser[${i}] | ${JSON.stringify(session)}`);
                }
            }
        });
    }


    console.log(`SESSION | ${JSON.stringify(session)}`);


    var logoutUser_args = [
        {
            'session': session
        },
        {
            'session': null
        },
        {
            'session': undefined
        },
        {
            'session': 'string'
        },
        {
            'session': 8
        },
        {
            'session': []
        },
    ];
    for (let i = 0; i < logoutUser_args.length; i++) {
        await ugle_auth.logoutUser(logoutUser_args[i], (err) => {
            if (err) {
                console.log(`FAIL | logoutUser[${i}] | ${err.message}`);
            } else {
                console.log(`PASS | logoutUser[${i}] | ${JSON.stringify(session)}`);
            }
        });
    }


    console.log(`SESSION | ${JSON.stringify(session)}`);


    var deleteUser_args = [
        {
            'delete_key': 'id',
            'delete_value': 1
        },
        {
            'delete_key': 'id',
            'delete_value': 3
        },
        {
            'delete_key': 'id',
            'delete_value': '0'
        },
        {
            'delete_key': 'email',
            'delete_value': 1
        },
        {
            'delete_key': 'email',
            'delete_value': 'christian.j.kesler@gmail'
        },
        {
            'delete_key': 'email',
            'delete_value': 'uglesoft@gmail.com'
        },
    ];
    for (let i = 0; i < deleteUser_args.length; i++) {
        await ugle_auth.deleteUser(dtb, deleteUser_args[i], (err, changes) => {
            if (err) {
                console.log(`FAIL | deleteUser[${i}] | ${err.message}`);
            } else {
                console.log(`PASS | deleteUser[${i}] | ${changes.message}`);
            }
        });
    }


    await ugle_auth.allUsers(dtb, (err, data) => {
        if (err) {
            console.log('[ ] allUsers(nominal) failed: ' + err.message);
        } else {
            console.log('[X] allUsers(nominal) passed | ' + JSON.stringify(data));
        }
    });

});
