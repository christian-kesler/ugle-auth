const dotenv = require('dotenv');
dotenv.config();


const ugle_auth = require(`${__dirname}/../index.js`);




/* 
    The console output will begin with [X] EXPECTED if the behavior is expected and [ ] UNEXPECTED if the behavior is unexpected.
 
    If the package is functioning as it should, the entirety of the terminal output from this program will begin with [X].
*/
var err_count = 0;




(async () => {
    return new Promise((resolve) => {

        ugle_auth.initDtb(`${__dirname}/test.db`, (err, dtb) => {
            if (err) {
                console.debug(`[ ] UNEXPECTED FAIL | new sqlite3.Database | ${err.message}`);
                err_count++;
                resolve(null);
            } else {
                console.debug('[X] EXPECTED PASS | new sqlite3.Database');
                dtb.exec('DROP TABLE IF EXISTS auth;');
                resolve(dtb);
            }
        });
    });
})().then(async (dtb) => {




    global.session = {};


    var createUser_args = [
        // valid strings
        {
            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
                'perms': undefined,
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },

        // absent
        {

            'create_params': {
                'password': 'personalPassword',
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
                'created_by': 'Me',
            }
        },
        {

            'create_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
                'created_at': 'Today :)',
                'created_by': 'Me',
            }
        },
    ];
    var readUser_args = [
        // valid strings
        {
            'email': 'uglesoft@gmail.com',
        },
        {
            'email': 'christian.j.kesler@gmail.com',
        },
        // invalid strings
        {
            'email': 'fake',
        },
        {
            'email': 8,
        },
        // objects
        {
            'email': {},
        },
        // arrays
        {
            'email': [],
        },
        // null
        {
            'email': null,
        },
        // undefined
        {
            'email': undefined,
        },
        // absent
        {
        },
    ];
    var updateUser_args = [
        // valid strings
        {
            'update_field': 'perms',
            'update_params': {
                'data': {
                    'administrator': true,
                    'tester': false
                },
            },
            'email': 'christian.j.kesler@gmail.com'
        },
        {
            'update_field': 'status',
            'update_params': {
                'data': 'pending',
            },
            'email': 'christian.j.kesler@gmail.com'
        },

        // invalid strings
        {
            'update_field': 'fake',
            'update_params': {
                'data': 'A Cool Test Script',
            },
            'email': 'christian.j.kesler@gmail.com'
        },
        {
            'update_field': 'created_by',
            'update_params': {
                'data': 'A Cool Test Script',
            },
            'email': 'christian.j.kesler@gmail.com'
        },
        {
            'update_field': 'created_by',
            'update_params': {
                'data': 'A Cool Test Script',
            },
            'email': 'fake'
        },
        {
            'update_field': 'perms',
            'update_params': {
                'data': 'puppy',
            },
            'email': 'christian.j.kesler@gmail.com'
        },

        // integers
        {
            'update_field': 8,
            'update_params': {
                'data': 'new_password',
                'salt': process.env.AUTH_SALT,
            },
            'email': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': 8,
                'salt': process.env.AUTH_SALT,
            },
            'email': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': 'new_password',
                'salt': 8,
            },
            'email': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'created_by',
            'update_params': {
                'data': 8,
                'salt': process.env.AUTH_SALT,
            },
            'email': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'created_by',
            'update_params': {
                'data': 'new_password',
                'salt': 8,
            },
            'email': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': 'new_password',
                'salt': process.env.AUTH_SALT,
            },
            'email': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': 'new_password',
                'salt': process.env.AUTH_SALT,
            },
            'email': 8
        },
        {
            'update_field': 'perms',
            'update_params': {
                'data': {
                    'administrator': 8,
                    'tester': false
                },
            },
            'email': 'christian.j.kesler@gmail.com'
        },
        {
            'update_field': 'perms',
            'update_params': {
                'data': 8,
            },
            'email': 'christian.j.kesler@gmail.com'
        },
        {
            'update_field': 'tempkey',
            'update_params': {
                'data': 8,
            },
            'email': 'christian.j.kesler@gmail.com'
        },


        // objects
        {
            'update_field': {},
            'update_params': {
                'data': 'new_password',
                'salt': process.env.AUTH_SALT,
            },
            'email': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': {},
                'salt': process.env.AUTH_SALT,
            },
            'email': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': 'new_password',
                'salt': {},
            },
            'email': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'created_by',
            'update_params': {
                'data': {},
                'salt': process.env.AUTH_SALT,
            },
            'email': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'created_by',
            'update_params': {
                'data': 'new_password',
                'salt': {},
            },
            'email': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': 'new_password',
                'salt': process.env.AUTH_SALT,
            },
            'email': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': 'new_password',
                'salt': process.env.AUTH_SALT,
            },
            'email': {}
        },
        {
            'update_field': 'perms',
            'update_params': {
                'data': {
                    'administrator': {},
                    'tester': false
                },
            },
            'email': 'christian.j.kesler@gmail.com'
        },
        {
            'update_field': 'perms',
            'update_params': {
                'data': {},
            },
            'email': 'christian.j.kesler@gmail.com'
        },
        {
            'update_field': 'tempkey',
            'update_params': {
                'data': {},
            },
            'email': 'christian.j.kesler@gmail.com'
        },

        // arrays
        {
            'update_field': [],
            'update_params': {
                'data': 'new_password',
                'salt': process.env.AUTH_SALT,
            },
            'email': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': [],
                'salt': process.env.AUTH_SALT,
            },
            'email': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': 'new_password',
                'salt': [],
            },
            'email': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'created_by',
            'update_params': {
                'data': [],
                'salt': process.env.AUTH_SALT,
            },
            'email': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'created_by',
            'update_params': {
                'data': 'new_password',
                'salt': [],
            },
            'email': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': 'new_password',
                'salt': process.env.AUTH_SALT,
            },
            'email': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': 'new_password',
                'salt': process.env.AUTH_SALT,
            },
            'email': []
        },
        {
            'update_field': 'perms',
            'update_params': {
                'data': {
                    'administrator': [],
                    'tester': false
                },
            },
            'email': 'christian.j.kesler@gmail.com'
        },
        {
            'update_field': 'perms',
            'update_params': {
                'data': [],
            },
            'email': 'christian.j.kesler@gmail.com'
        },
        {
            'update_field': 'tempkey',
            'update_params': {
                'data': [],
            },
            'email': 'christian.j.kesler@gmail.com'
        },

        // null
        {
            'update_field': null,
            'update_params': {
                'data': 'new_password',
                'salt': process.env.AUTH_SALT,
            },
            'email': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': null,
                'salt': process.env.AUTH_SALT,
            },
            'email': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': 'new_password',
                'salt': null,
            },
            'email': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'created_by',
            'update_params': {
                'data': null,
                'salt': process.env.AUTH_SALT,
            },
            'email': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'created_by',
            'update_params': {
                'data': 'new_password',
                'salt': null,
            },
            'email': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': 'new_password',
                'salt': process.env.AUTH_SALT,
            },
            'email': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': 'new_password',
                'salt': process.env.AUTH_SALT,
            },
            'email': null
        },
        {
            'update_field': 'perms',
            'update_params': {
                'data': {
                    'administrator': null,
                    'tester': false
                },
            },
            'email': 'christian.j.kesler@gmail.com'
        },
        {
            'update_field': 'perms',
            'update_params': {
                'data': null,
            },
            'email': 'christian.j.kesler@gmail.com'
        },
        {
            'update_field': 'tempkey',
            'update_params': {
                'data': null,
            },
            'email': 'christian.j.kesler@gmail.com'
        },

        // undefined
        {
            'update_field': undefined,
            'update_params': {
                'data': 'new_password',
                'salt': process.env.AUTH_SALT,
            },
            'email': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': undefined,
                'salt': process.env.AUTH_SALT,
            },
            'email': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': 'new_password',
                'salt': undefined,
            },
            'email': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'created_by',
            'update_params': {
                'data': undefined,
                'salt': process.env.AUTH_SALT,
            },
            'email': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'created_by',
            'update_params': {
                'data': 'new_password',
                'salt': undefined,
            },
            'email': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': 'new_password',
                'salt': process.env.AUTH_SALT,
            },
            'email': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': 'new_password',
                'salt': process.env.AUTH_SALT,
            },
            'email': undefined
        },
        {
            'update_field': 'perms',
            'update_params': {
                'data': {
                    'administrator': undefined,
                    'tester': false
                },
            },
            'email': 'christian.j.kesler@gmail.com'
        },
        {
            'update_field': 'perms',
            'update_params': {
                'data': undefined,
            },
            'email': 'christian.j.kesler@gmail.com'
        },
        {
            'update_field': 'tempkey',
            'update_params': {
                'data': undefined,
            },
            'email': 'christian.j.kesler@gmail.com'
        },

        // absent
        {
            'update_params': {
                'data': 'new_password',
                'salt': process.env.AUTH_SALT,
            },
            'email': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'salt': process.env.AUTH_SALT,
            },
            'email': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': 'new_password',
            },
            'email': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'created_by',
            'update_params': {
                'salt': process.env.AUTH_SALT,
            },
            'email': 'uglesoft@gmail.com'
        },
        {
            'update_field': 'hash',
            'update_params': {
                'data': 'new_password',
                'salt': process.env.AUTH_SALT,
            },
        },
        {
            'update_field': 'tempkey',
            'email': 'christian.j.kesler@gmail.com'
        },

    ];
    var deleteUser_args = [
        // valid entries
        {
            'email': 'christian.j.kesler@gmail.com'
        },
        {
            'email': 'uglesoft@gmail.com'
        },
        // invalid entries
        {
            'email': '1'
        },
        {
            'email': 'fake'
        },
        // integers
        {
            'email': 8
        },
        // objects
        {
            'email': {}
        },
        // arrays
        {
            'email': []
        },
        // null
        {
            'email': null
        },
        // undefined
        {
            'email': undefined
        },
        // absent
        {
        },
    ];

    var loginUser_args = [
        // valid strings
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': process.env.AUTH_SALT,
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'uglesoft@gmail.com',
                'password': 'uglesoftPassword',
                'salt': process.env.AUTH_SALT,
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': process.env.AUTH_SALT,
            },
            'session': {}
        },

        // invalid strings
        {
            'login_params': {
                'email': 'fake@gmail',
                'password': 'personalPassword',
                'salt': process.env.AUTH_SALT,
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'fake',
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 8,
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': {},
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': [],
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': null,
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': undefined,
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
            },
        },
    ];
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




    // createUser
    for (let i = 0; i < createUser_args.length; i++) {
        await ugle_auth.createUser(dtb, createUser_args[i], (err) => {
            if (i <= 1) {
                if (err) {
                    console.debug(`[ ] UNEXPECTED FAIL | createUser[${i}] | ${err.message}`);
                    err_count++;
                } else {
                    console.debug(`[X] EXPECTED PASS | createUser[${i}]`);
                }
            } else {
                if (err) {
                    console.debug(`[X] EXPECTED FAIL | createUser[${i}] | ${err.message}`);
                } else {
                    console.debug(`[ ] UNEXPECTED PASS | createUser[${i}]`);
                    err_count++;
                }
            }
        });
    }

    // readUser
    for (let i = 0; i < readUser_args.length; i++) {
        await ugle_auth.readUser(dtb, readUser_args[i], (err, data) => {
            if (i <= 1) {
                if (err) {
                    console.debug(`[ ] UNEXPECTED FAIL | readUser[${i}] | ${err.message}`);
                    err_count++;
                } else {
                    console.debug(`[X] EXPECTED PASS | readUser[${i}] | ${data}`);
                }
            } else {
                if (err) {
                    console.debug(`[X] EXPECTED FAIL | readUser[${i}] | ${err.message}`);
                } else {
                    console.debug(`[ ] UNEXPECTED PASS | readUser[${i}] | ${data}`);
                    err_count++;
                }
            }
        });
    }

    // allUsers
    await ugle_auth.allUsers(dtb, (err, data) => {
        if (err) {
            console.debug('[ ] UNEXPECTED allUsers(nominal) failed: ' + err.message);
            err_count++;
        } else {
            console.debug('[X] EXPECTED allUsers(nominal) passed : ');
            console.debug(data);
        }
    });

    // loginUser
    for (let i = 0; i < loginUser_args.length; i++) {
        await ugle_auth.loginUser(dtb, loginUser_args[i], (err, data) => {
            if (i <= 2) {
                if (err) {
                    console.debug(`[ ] UNEXPECTED FAIL | loginUser[${i}] | ${err.message}`);
                    err_count++;
                } else {
                    global.session = data;

                    console.debug(`[X] EXPECTED PASS | loginUser[${i}] | ${JSON.stringify(session)}`);
                }
            } else {
                if (err) {
                    console.debug(`[X] EXPECTED FAIL | loginUser[${i}] | ${err.message}`);
                } else {
                    global.session = data;

                    console.debug(`[ ] UNEXPECTED PASS | loginUser[${i}] | ${JSON.stringify(session)}`);
                    err_count++;
                }
            }
        });
    }

    // allUsers
    await ugle_auth.allUsers(dtb, (err, data) => {
        if (err) {
            console.debug('[ ] UNEXPECTED allUsers(nominal) failed: ' + err.message);
            err_count++;
        } else {
            console.debug('[X] EXPECTED allUsers(nominal) passed : ');
            console.debug(data);
        }
    });

    // logoutUser
    for (let i = 0; i < logoutUser_args.length; i++) {
        await ugle_auth.logoutUser(logoutUser_args[i], (err, data) => {
            if (i <= 1) {
                if (err) {
                    console.debug(`[ ] UNEXPECTED FAIL | logoutUser[${i}] | ${err.message}`);
                    err_count++;
                } else {
                    global.session = data;

                    console.debug(`[X] EXPECTED PASS | logoutUser[${i}] | ${JSON.stringify(session)}`);
                }
            } else {
                if (err) {
                    console.debug(`[X] EXPECTED FAIL | logoutUser[${i}] | ${err.message}`);
                } else {
                    global.session = data;

                    console.debug(`[ ] UNEXPECTED PASS | logoutUser[${i}] | ${JSON.stringify(session)}`);
                    err_count++;
                }
            }
        });
    }

    // updateUser
    for (let i = 0; i < updateUser_args.length; i++) {
        await ugle_auth.updateUser(dtb, updateUser_args[i], (err, changes) => {
            if (i <= 1) {
                if (err) {
                    console.debug(`[ ] UNEXPECTED FAIL | updateUser[${i}] | ${err.message}`);
                    err_count++;
                } else {
                    console.debug(`[X] EXPECTED PASS | updateUser[${i}] | ${changes.message}`);
                }
            } else {
                if (err) {
                    console.debug(`[X] EXPECTED FAIL | updateUser[${i}] | ${err.message}`);
                } else {
                    console.debug(`[ ] UNEXPECTED PASS | updateUser[${i}] | ${changes.message}`);
                    err_count++;
                }
            }
        });
    }

    // allUsers
    await ugle_auth.allUsers(dtb, (err, data) => {
        if (err) {
            console.debug('[ ] UNEXPECTED allUsers(nominal) failed: ' + err.message);
            err_count++;
        } else {
            console.debug('[X] EXPECTED allUsers(nominal) passed : ');
            console.debug(data);
        }
    });




    // loginUser with new creds
    loginUser_args = [
        // valid strings
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': process.env.AUTH_SALT,
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'uglesoft@gmail.com',
                'password': 'new_password',
                'salt': process.env.AUTH_SALT,
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'personalPassword',
                'salt': process.env.AUTH_SALT,
            },
            'session': {}
        },

        // invalid strings
        {
            'login_params': {
                'email': 'fake@gmail',
                'password': 'personalPassword',
                'salt': process.env.AUTH_SALT,
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 'fake',
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': 8,
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': {},
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': [],
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': null,
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'password': undefined,
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
            },
            'session': session
        },
        {
            'login_params': {
                'email': 'christian.j.kesler@gmail.com',
                'salt': process.env.AUTH_SALT,
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
                'salt': process.env.AUTH_SALT,
            },
        },
    ];
    for (let i = 0; i < loginUser_args.length; i++) {
        await ugle_auth.loginUser(dtb, loginUser_args[i], (err, data) => {
            if (i <= 1) {
                if (err) {
                    console.debug(`[ ] UNEXPECTED FAIL | loginUser[${i}] | ${err.message}`);
                    err_count++;
                } else {
                    global.session = data;

                    console.debug(`[X] EXPECTED PASS | loginUser[${i}] | ${JSON.stringify(session)}`);
                }
            } else {
                if (err) {
                    console.debug(`[X] EXPECTED FAIL | loginUser[${i}] | ${err.message}`);
                } else {
                    global.session = data;

                    console.debug(`[ ] UNEXPECTED PASS | loginUser[${i}] | ${JSON.stringify(session)}`);
                    err_count++;
                }
            }
        });
    }

    // allUsers
    await ugle_auth.allUsers(dtb, (err, data) => {
        if (err) {
            console.debug('[ ] UNEXPECTED allUsers(nominal) failed: ' + err.message);
            err_count++;
        } else {
            console.debug('[X] EXPECTED allUsers(nominal) passed : ');
            console.debug(data);
        }
    });

    // logoutUser
    for (let i = 0; i < logoutUser_args.length; i++) {
        await ugle_auth.logoutUser(logoutUser_args[i], (err, data) => {
            if (i <= 1) {
                if (err) {
                    console.debug(`[ ] UNEXPECTED FAIL | logoutUser[${i}] | ${err.message}`);
                    err_count++;
                } else {
                    global.session = data;

                    console.debug(`[X] EXPECTED PASS | logoutUser[${i}] | ${JSON.stringify(session)}`);
                }
            } else {
                if (err) {
                    console.debug(`[X] EXPECTED FAIL | logoutUser[${i}] | ${err.message}`);
                } else {
                    global.session = data;

                    console.debug(`[ ] UNEXPECTED PASS | logoutUser[${i}] | ${JSON.stringify(session)}`);
                    err_count++;
                }
            }
        });
    }

    // deleteUser
    for (let i = 0; i < deleteUser_args.length; i++) {
        await ugle_auth.deleteUser(dtb, deleteUser_args[i], (err, changes) => {
            if (i <= 1) {
                if (err) {
                    console.debug(`[ ] UNEXPECTED FAIL | deleteUser[${i}] | ${err.message}`);
                    err_count++;
                } else {
                    console.debug(`[X] EXPECTED PASS | deleteUser[${i}] | ${changes.message}`);
                }
            } else {
                if (err) {
                    console.debug(`[X] EXPECTED FAIL | deleteUser[${i}] | ${err.message}`);
                } else {
                    console.debug(`[ ] UNEXPECTED PASS | deleteUser[${i}] | ${changes.message}`);
                    err_count++;
                }
            }
        });
    }

    // allUsers
    await ugle_auth.allUsers(dtb, (err, data) => {
        if (err) {
            console.debug('[ ] UNEXPECTED allUsers(nominal) failed: ' + err.message);
            err_count++;
        } else {
            console.debug('[X] EXPECTED allUsers(nominal) passed : ');
            console.debug(data);
        }
    });




    console.debug();
    console.debug();
    console.debug();
    console.debug();
    console.info(`AUTOMATED TEST COMPLETED: ${err_count} errors found`);
    // console.warn(`FOR MANUAL TESTING, PLEASE NAVIGATE TO http://localhost:3000/auth IN YOUR BROWSER OF CHOICE`)




});