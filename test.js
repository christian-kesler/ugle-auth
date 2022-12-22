const ugle_auth = require('./index.js');
/* 
    The console output will begin with [X] EXPECTED if the behavior is expected and [ ] UNEXPECTED if the behavior is unexpected.
 
    If the package is functioning as it should, the entirety of the terminal output from this program will begin with [X].
*/




(async () => {
    return new Promise((resolve) => {

        ugle_auth.initDtb('./test.db', (err, dtb) => {
            if (err) {
                console.log(`[ ] UNEXPECTED FAIL | new sqlite3.Database | ${err.message}`);
                resolve(null);
            } else {
                console.log('[X] EXPECTED PASS | new sqlite3.Database');
                dtb.exec('DROP TABLE IF EXISTS auth;');
                resolve(dtb);
            }
        })
    });
})().then(async (dtb) => {


    var createUser_args = [
        // valid strings
        {
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'perms': {
                    'admin': false,
                    'user': true,
                },
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {

            'create_params': {
                'email': 'uglesoft@gmail.com',
                'password': 'uglesoftPassword',
                'salt': 'uglesoftSalt',
                'perms': {
                    'mage': false,
                    'user': true,
                    'GOD': true
                },
                'created_at': 'This Exact Moment',
                'created_by': 'The Supreme Owl Tester',
            }
        },
        // invalid strings
        {

            'create_params': {
                'email': 'c@gmail',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'perms': {
                    'admin': false,
                    'user': true,
                },
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {

            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'pass',
                'salt': 'personalSalt',
                'perms': {
                    'admin': false,
                    'user': true,
                },
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {

            'create_params': 'args_obj'
        },
        {

            'create_params': {
                'email': 'j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'perms': 'puppy',
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        // integers
        {

            'create_params': {
                'email': 8,
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'perms': {
                    'admin': false,
                    'user': true,
                },
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {

            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 8,
                'salt': 'personalSalt',
                'perms': {
                    'admin': false,
                    'user': true,
                },
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {

            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 8,
                'perms': {
                    'admin': false,
                    'user': true,
                },
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {

            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'perms': {
                    'admin': false,
                    'user': true,
                },
                'created_at': 8,
                'created_by': 'Me',
            }
        },
        {

            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'perms': {
                    'admin': false,
                    'user': true,
                },
                'created_at': 'Today :)',
                'created_by': 8,
            }
        },
        {

            'create_params': 8
        },
        {

            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'perms': {
                    'admin': 8,
                    'user': true,
                },
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {

            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'perms': 8,
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },

        // objects
        {

            'create_params': {
                'email': {},
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'perms': {
                    'admin': false,
                    'user': true,
                },
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {

            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': {},
                'salt': 'personalSalt',
                'perms': {
                    'admin': false,
                    'user': true,
                },
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {

            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': {},
                'perms': {
                    'admin': false,
                    'user': true,
                },
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {

            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'perms': {
                    'admin': false,
                    'user': true,
                },
                'created_at': {},
                'created_by': 'Me',
            }
        },
        {

            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'perms': {
                    'admin': false,
                    'user': true,
                },
                'created_at': 'Today :)',
                'created_by': {},
            }
        },
        {

            'create_params': {}
        },
        {

            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'perms': {
                    'admin': {},
                    'user': true,
                },
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {

            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'perms': {},
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },

        // arrays
        {

            'create_params': {
                'email': [],
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'perms': {
                    'admin': false,
                    'user': true,
                },
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {

            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': [],
                'salt': 'personalSalt',
                'perms': {
                    'admin': false,
                    'user': true,
                },
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {

            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': [],
                'perms': {
                    'admin': false,
                    'user': true,
                },
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {

            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'perms': {
                    'admin': false,
                    'user': true,
                },
                'created_at': [],
                'created_by': 'Me',
            }
        },
        {

            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'perms': {
                    'admin': false,
                    'user': true,
                },
                'created_at': 'Today :)',
                'created_by': [],
            }
        },
        {

            'create_params': []
        },
        {

            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'perms': {
                    'admin': [],
                    'user': true,
                },
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {

            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'perms': [],
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },

        // null
        {

            'create_params': {
                'email': null,
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'perms': {
                    'admin': false,
                    'user': true,
                },
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {

            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': null,
                'salt': 'personalSalt',
                'perms': {
                    'admin': false,
                    'user': true,
                },
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {

            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': null,
                'perms': {
                    'admin': false,
                    'user': true,
                },
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {

            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'perms': {
                    'admin': false,
                    'user': true,
                },
                'created_at': null,
                'created_by': 'Me',
            }
        },
        {

            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'perms': {
                    'admin': false,
                    'user': true,
                },
                'created_at': 'Today :)',
                'created_by': null,
            }
        },
        {

            'create_params': null
        },
        {

            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'perms': {
                    'admin': null,
                    'user': true,
                },
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {

            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'perms': null,
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },

        // undefined
        {

            'create_params': {
                'email': undefined,
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'perms': {
                    'admin': false,
                    'user': true,
                },
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {

            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': undefined,
                'salt': 'personalSalt',
                'perms': {
                    'admin': false,
                    'user': true,
                },
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {

            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': undefined,
                'perms': {
                    'admin': false,
                    'user': true,
                },
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {

            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'perms': {
                    'admin': false,
                    'user': true,
                },
                'created_at': undefined,
                'created_by': 'Me',
            }
        },
        {

            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'perms': {
                    'admin': false,
                    'user': true,
                },
                'created_at': 'Today :)',
                'created_by': undefined,
            }
        },
        {

            'create_params': undefined,
        },
        {

            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'perms': {
                    'admin': undefined,
                    'user': true,
                },
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {

            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'perms': undefined,
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },

        // absent
        {

            'create_params': {
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'perms': {
                    'admin': false,
                    'user': true,
                },
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {

            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'salt': 'personalSalt',
                'perms': {
                    'admin': false,
                    'user': true,
                },
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {

            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'perms': {
                    'admin': false,
                    'user': true,
                },
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
        {

            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'created_by': 'Me',
            }
        },
        {

            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'perms': {
                    'admin': false,
                    'user': true,
                },
                'created_at': 'Today :)',
            }
        },
        {

            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
    ];
    for (let i = 0; i < createUser_args.length; i++) {
        await ugle_auth.createUser(dtb, createUser_args[i], (err) => {
            if (i <= 1) {
                if (err) {
                    console.log(`[ ] UNEXPECTED FAIL | createUser[${i}] | ${err.message}`);
                } else {
                    console.log(`[X] EXPECTED PASS | createUser[${i}]`);
                }
            } else {
                if (err) {
                    console.log(`[X] EXPECTED FAIL | createUser[${i}] | ${err.message}`);
                } else {
                    console.log(`[ ] UNEXPECTED PASS | createUser[${i}]`);
                }
            }
        });
    }




    var readUser_args = [
        // valid strings
        {
            'read_fields': 'id, email, perms, created_at, created_by',
            'read_key': 'id',
            'read_value': '2',
        },
        {
            'read_fields': 'id, email, perms, created_at, created_by',
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
                    console.log(`[ ] UNEXPECTED FAIL | readUser[${i}] | ${err.message}`);
                } else {
                    console.log(`[X] EXPECTED PASS | readUser[${i}] | ${JSON.stringify(data)}`);
                }
            } else {
                if (err) {
                    console.log(`[X] EXPECTED FAIL | readUser[${i}] | ${err.message}`);
                } else {
                    console.log(`[ ] UNEXPECTED PASS | readUser[${i}] | ${JSON.stringify(data)}`);
                }
            }
        });
    }




    global.session = {};
    await ugle_auth.allUsers(dtb, (err, data) => {
        if (err) {
            console.log('[ ] UNEXPECTED allUsers(nominal) failed: ' + err.message);
        } else {
            console.log('[X] EXPECTED allUsers(nominal) passed | ' + JSON.stringify(data));
        }
    });




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
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
            },
            'session': {}
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
        // invalid spam for lockout
        {
            'login_params': {
                'email': 'uglesoft@gmail.com',
                'password': 'personalPassword',
                'salt': 'fake',
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'uglesoft@gmail.com',
                'password': 'personalPassword',
                'salt': 'fake',
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'uglesoft@gmail.com',
                'password': 'personalPassword',
                'salt': 'fake',
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'uglesoft@gmail.com',
                'password': 'personalPassword',
                'salt': 'fake',
            },
            'session': session
        },
        // valid strings to test lockout
        {
            'login_params': {
                'email': 'uglesoft@gmail.com',
                'password': 'uglesoftPassword',
                'salt': 'uglesoftSalt',
            },
            'session': session
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
        await ugle_auth.loginUser(dtb, loginUser_args[i], (err, data) => {
            if (i <= 2) {
                if (err) {
                    console.log(`[ ] UNEXPECTED FAIL | loginUser[${i}] | ${err.message}`);
                } else {
                    global.session = data;

                    console.log(`[X] EXPECTED PASS | loginUser[${i}] | ${JSON.stringify(session)}`);
                }
            } else {
                if (err) {
                    console.log(`[X] EXPECTED FAIL | loginUser[${i}] | ${err.message}`);
                } else {
                    global.session = data;

                    console.log(`[ ] UNEXPECTED PASS | loginUser[${i}] | ${JSON.stringify(session)}`);
                }
            }
        });
    }




    await ugle_auth.allUsers(dtb, (err, data) => {
        if (err) {
            console.log('[ ] UNEXPECTED allUsers(nominal) failed: ' + err.message);
        } else {
            console.log('[X] EXPECTED allUsers(nominal) passed | ' + JSON.stringify(data));
        }
    });




    var logoutUser_args = [
        // valid strings
        {
            'session': session
        },
        {
            'session': {}
        },
        // invalid strings
        {
            'session': 'string'
        },
        // integers
        {
            'session': 8
        },
        // arrays
        {
            'session': []
        },
        // null
        {
            'session': null
        },
        // undefined
        {
            'session': undefined
        },
        // absent
        {},
    ];
    for (let i = 0; i < logoutUser_args.length; i++) {
        await ugle_auth.logoutUser(logoutUser_args[i], (err, data) => {
            if (i <= 1) {
                if (err) {
                    console.log(`[ ] UNEXPECTED FAIL | logoutUser[${i}] | ${err.message}`);
                } else {
                    global.session = data;

                    console.log(`[X] EXPECTED PASS | logoutUser[${i}] | ${JSON.stringify(session)}`);
                }
            } else {
                if (err) {
                    console.log(`[X] EXPECTED FAIL | logoutUser[${i}] | ${err.message}`);
                } else {
                    global.session = data;

                    console.log(`[ ] UNEXPECTED PASS | logoutUser[${i}] | ${JSON.stringify(session)}`);
                }
            }
        });
    }




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
            'update_field': 'perms',
            'update_params': {
                'data': {
                    'administrator': true,
                    'tester': false
                },
            },
            'update_key': 'email',
            'update_value': 'christian.j.kesler@gmail.com'
        },
        {
            'update_field': 'tempkey',
            'update_params': {
                'data': 'a random string',
                'salt': 'a random salt',
            },
            'update_key': 'email',
            'update_value': 'christian.j.kesler@gmail.com'
        },
        {
            'update_field': 'tempkey',
            'update_params': {
                'data': false,
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
        {
            'update_field': 'perms',
            'update_params': {
                'data': 'puppy',
            },
            'update_key': 'email',
            'update_value': 'christian.j.kesler@gmail.com'
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
        {
            'update_field': 'perms',
            'update_params': {
                'data': {
                    'administrator': 8,
                    'tester': false
                },
            },
            'update_key': 'email',
            'update_value': 'christian.j.kesler@gmail.com'
        },
        {
            'update_field': 'perms',
            'update_params': {
                'data': 8,
            },
            'update_key': 'email',
            'update_value': 'christian.j.kesler@gmail.com'
        },
        {
            'update_field': 'tempkey',
            'update_params': {
                'data': 8,
            },
            'update_key': 'email',
            'update_value': 'christian.j.kesler@gmail.com'
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
        {
            'update_field': 'perms',
            'update_params': {
                'data': {
                    'administrator': {},
                    'tester': false
                },
            },
            'update_key': 'email',
            'update_value': 'christian.j.kesler@gmail.com'
        },
        {
            'update_field': 'perms',
            'update_params': {
                'data': {},
            },
            'update_key': 'email',
            'update_value': 'christian.j.kesler@gmail.com'
        },
        {
            'update_field': 'tempkey',
            'update_params': {
                'data': {},
            },
            'update_key': 'email',
            'update_value': 'christian.j.kesler@gmail.com'
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
        {
            'update_field': 'perms',
            'update_params': {
                'data': {
                    'administrator': [],
                    'tester': false
                },
            },
            'update_key': 'email',
            'update_value': 'christian.j.kesler@gmail.com'
        },
        {
            'update_field': 'perms',
            'update_params': {
                'data': [],
            },
            'update_key': 'email',
            'update_value': 'christian.j.kesler@gmail.com'
        },
        {
            'update_field': 'tempkey',
            'update_params': {
                'data': [],
            },
            'update_key': 'email',
            'update_value': 'christian.j.kesler@gmail.com'
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
        {
            'update_field': 'perms',
            'update_params': {
                'data': {
                    'administrator': null,
                    'tester': false
                },
            },
            'update_key': 'email',
            'update_value': 'christian.j.kesler@gmail.com'
        },
        {
            'update_field': 'perms',
            'update_params': {
                'data': null,
            },
            'update_key': 'email',
            'update_value': 'christian.j.kesler@gmail.com'
        },
        {
            'update_field': 'tempkey',
            'update_params': {
                'data': null,
            },
            'update_key': 'email',
            'update_value': 'christian.j.kesler@gmail.com'
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
        {
            'update_field': 'perms',
            'update_params': {
                'data': {
                    'administrator': undefined,
                    'tester': false
                },
            },
            'update_key': 'email',
            'update_value': 'christian.j.kesler@gmail.com'
        },
        {
            'update_field': 'perms',
            'update_params': {
                'data': undefined,
            },
            'update_key': 'email',
            'update_value': 'christian.j.kesler@gmail.com'
        },
        {
            'update_field': 'tempkey',
            'update_params': {
                'data': undefined,
            },
            'update_key': 'email',
            'update_value': 'christian.j.kesler@gmail.com'
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
        {
            'update_field': 'tempkey',
            'update_key': 'email',
            'update_value': 'christian.j.kesler@gmail.com'
        },

    ];
    for (let i = 0; i < updateUser_args.length; i++) {
        await ugle_auth.updateUser(dtb, updateUser_args[i], (err, changes) => {
            if (i <= 3) {
                if (err) {
                    console.log(`[ ] UNEXPECTED FAIL | updateUser[${i}] | ${err.message}`);
                } else {
                    console.log(`[X] EXPECTED PASS | updateUser[${i}] | ${changes.message}`);
                }
            } else {
                if (err) {
                    console.log(`[X] EXPECTED FAIL | updateUser[${i}] | ${err.message}`);
                } else {
                    console.log(`[ ] UNEXPECTED PASS | updateUser[${i}] | ${changes.message}`);
                }
            }
        });
    }




    await ugle_auth.allUsers(dtb, (err, data) => {
        if (err) {
            console.log('[ ] UNEXPECTED allUsers(nominal) failed: ' + err.message);
        } else {
            console.log('[X] EXPECTED allUsers(nominal) passed | ' + JSON.stringify(data));
        }
    });




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
                'password': 'new_password',
                'salt': 'exampleSalt',
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
        // invalid spam for lockout
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
                'salt': 'fake',
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
                'salt': 'fake',
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
                'salt': 'fake',
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
                'salt': 'fake',
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
                'salt': 'fake',
            },
            'session': session
        },
        // valid strings to test lockout
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': 'personalSalt',
            },
            'session': session
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
        await ugle_auth.loginUser(dtb, loginUser_args[i], (err, data) => {
            if (i <= 2) {
                if (err) {
                    console.log(`[ ] UNEXPECTED FAIL | loginUser[${i}] | ${err.message}`);
                } else {
                    global.session = data;

                    console.log(`[X] EXPECTED PASS | loginUser[${i}] | ${JSON.stringify(session)}`);
                }
            } else {
                if (err) {
                    console.log(`[X] EXPECTED FAIL | loginUser[${i}] | ${err.message}`);
                } else {
                    global.session = data;

                    console.log(`[ ] UNEXPECTED PASS | loginUser[${i}] | ${JSON.stringify(session)}`);
                }
            }
        });
    }




    await ugle_auth.allUsers(dtb, (err, data) => {
        if (err) {
            console.log('[ ] UNEXPECTED allUsers(nominal) failed: ' + err.message);
        } else {
            console.log('[X] EXPECTED allUsers(nominal) passed | ' + JSON.stringify(data));
        }
    });




    var logoutUser_args = [
        // valid strings
        {
            'session': session
        },
        {
            'session': {}
        },
        // invalid strings
        {
            'session': 'string'
        },
        // integers
        {
            'session': 8
        },
        // arrays
        {
            'session': []
        },
        // null
        {
            'session': null
        },
        // undefined
        {
            'session': undefined
        },
        // absent
        {},
    ];
    for (let i = 0; i < logoutUser_args.length; i++) {
        await ugle_auth.logoutUser(logoutUser_args[i], (err, data) => {
            if (i <= 1) {
                if (err) {
                    console.log(`[ ] UNEXPECTED FAIL | logoutUser[${i}] | ${err.message}`);
                } else {
                    global.session = data;

                    console.log(`[X] EXPECTED PASS | logoutUser[${i}] | ${JSON.stringify(session)}`);
                }
            } else {
                if (err) {
                    console.log(`[X] EXPECTED FAIL | logoutUser[${i}] | ${err.message}`);
                } else {
                    global.session = data;

                    console.log(`[ ] UNEXPECTED PASS | logoutUser[${i}] | ${JSON.stringify(session)}`);
                }
            }
        });
    }




    var deleteUser_args = [
        // valid entries
        {
            'delete_key': 'id',
            'delete_value': '1'
        },
        {
            'delete_key': 'email',
            'delete_value': 'uglesoft@gmail.com'
        },
        // invalid entries
        {
            'delete_key': 'id',
            'delete_value': '1'
        },
        {
            'delete_key': 'email',
            'delete_value': 'uglesoft@gmail.com'
        },
        // integers
        {
            'delete_key': 8,
            'delete_value': '1'
        },
        {
            'delete_key': 'email',
            'delete_value': 8
        },
        // objects
        {
            'delete_key': {},
            'delete_value': '1'
        },
        {
            'delete_key': 'email',
            'delete_value': {}
        },
        // arrays
        {
            'delete_key': [],
            'delete_value': '1'
        },
        {
            'delete_key': 'email',
            'delete_value': []
        },
        // null
        {
            'delete_key': null,
            'delete_value': '1'
        },
        {
            'delete_key': 'email',
            'delete_value': null
        },
        // undefined
        {
            'delete_key': undefined,
            'delete_value': '1'
        },
        {
            'delete_key': 'email',
            'delete_value': undefined
        },
        // absent
        {
            'delete_value': '1'
        },
        {
            'delete_key': 'email',
        },
    ];
    for (let i = 0; i < deleteUser_args.length; i++) {
        await ugle_auth.deleteUser(dtb, deleteUser_args[i], (err, changes) => {
            if (i <= 1) {
                if (err) {
                    console.log(`[ ] UNEXPECTED FAIL | deleteUser[${i}] | ${err.message}`);
                } else {
                    console.log(`[X] EXPECTED PASS | deleteUser[${i}] | ${changes.message}`);
                }
            } else {
                if (err) {
                    console.log(`[X] EXPECTED FAIL | deleteUser[${i}] | ${err.message}`);
                } else {
                    console.log(`[ ] UNEXPECTED PASS | deleteUser[${i}] | ${changes.message}`);
                }
            }
        });
    }




    await ugle_auth.allUsers(dtb, (err, data) => {
        if (err) {
            console.log('[ ] UNEXPECTED allUsers(nominal) failed: ' + err.message);
        } else {
            console.log('[X] EXPECTED allUsers(nominal) passed | ' + JSON.stringify(data));
        }
    });

});