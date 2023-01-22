const dotenv = require('dotenv');
dotenv.config();


const ugle_auth = require(`${__dirname}/../index.js`);




/* 
    The console output will begin with [X]   EXPECTED if the behavior is expected and [ ] UNEXPECTED if the behavior is unexpected.
 
    If the package is functioning as it should, the entirety of the terminal output from this program will begin with [X].
*/
var err_count = 0;


single_args = [
    // valid of correct type
    null,
    // invalid of correct type
    null,
    // empty string
    'badstring',
    // integer
    8,
    // object
    {},
    // array
    [],
    // null
    null,
    // undefined
    undefined,
    // function
    () => { console.log('an example function') }
];




(async () => {




    /* BEGIN CONFIG METHODS */
    // ================================================================
    // connectToDatabase
    single_args[0] = `${__dirname}/database.db`;
    single_args[1] = `${__dirname}/fakepath/database.db`;
    testing = ugle_auth.connectToDatabase;
    for (let i = single_args.length - 1; i >= 0; i--) {
        await testing(single_args[i], (err, dtb) => {
            if (i == 0) {
                if (err) {
                    console.debug(`[ ] UNEXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                    err_count++;
                } else {
                    console.debug(`[X]   EXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(dtb)}`);
                    // dtb.exec('DROP TABLE IF EXISTS auth;');
                    // dtb.exec('DROP TABLE IF EXISTS auth_archive;');
                    // dtb.exec('DROP TABLE IF EXISTS auth_log;');
                    global.dtb = dtb;
                }
            } else {
                if (err) {
                    console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                } else {
                    // dtb.exec('DROP TABLE IF EXISTS auth;');
                    // dtb.exec('DROP TABLE IF EXISTS auth_archive;');
                    // dtb.exec('DROP TABLE IF EXISTS auth_log;');
                    global.dtb = dtb;
                    console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(dtb)}`);
                    err_count++;
                }
            }

        });
    }
    // connectToDatabase
    // ================================================================


    // ================================================================
    // formatDatabase
    single_args[0] = dtb;
    single_args[1] = '';
    testing = ugle_auth.formatDatabase;
    for (let i = single_args.length - 1; i >= 0; i--) {
        await testing(single_args[i], (err, dtb) => {
            if (i == 0) {
                if (err) {
                    console.debug(`[ ] UNEXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                    err_count++;
                } else {
                    console.debug(`[X]   EXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(dtb)}`);
                    // dtb.exec('DROP TABLE IF EXISTS auth;');
                    // dtb.exec('DROP TABLE IF EXISTS auth_archive;');
                    // dtb.exec('DROP TABLE IF EXISTS auth_log;');
                    global.dtb = dtb;
                }
            } else {
                if (err) {
                    console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                } else {
                    // dtb.exec('DROP TABLE IF EXISTS auth;');
                    // dtb.exec('DROP TABLE IF EXISTS auth_archive;');
                    // dtb.exec('DROP TABLE IF EXISTS auth_log;');
                    global.dtb = dtb;
                    console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(dtb)}`);
                    err_count++;
                }
            }

        });
    }
    // formatDatabase
    // ================================================================


    // ================================================================
    // defaultPerms
    single_args[0] = {
        'admin': false,
        'user': true,
    };
    single_args[1] = '';
    testing = ugle_auth.defaultPerms;
    for (let i = 0; i < single_args.length; i++) {
        await testing(single_args[i], (err) => {
            if (i <= 0) {
                if (err) {
                    console.debug(`[ ] UNEXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                    err_count++;
                } else {
                    console.debug(`[X]   EXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(default_perms)}`);
                }
            } else {
                if (err) {
                    console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                } else {
                    console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(default_perms)}`);
                    err_count++;
                }
            }

        });
    }
    // defaultPerms
    // ================================================================


    // ================================================================
    // lockoutPolicy
    single_args[0] = '4';
    single_args[1] = '-4';
    testing = ugle_auth.lockoutPolicy;
    for (let i = 0; i < single_args.length; i++) {
        await testing(single_args[i], (err) => {
            if (i == 0 || i == 3) {
                if (err) {
                    console.debug(`[ ] UNEXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                    err_count++;
                } else {
                    console.debug(`[X]   EXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(lockout_policy)}`);
                }
            } else {
                if (err) {
                    console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                } else {
                    console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(lockout_policy)}`);
                    err_count++;
                }
            }

        });
    }
    // lockoutPolicy
    // ================================================================


    // ================================================================
    // loginRedirect
    single_args[0] = '/account/home';
    single_args[1] = 'badroute';
    testing = ugle_auth.loginRedirect;
    for (let i = 0; i < single_args.length; i++) {
        await testing(single_args[i], (err) => {
            if (i <= 2) {
                if (err) {
                    console.debug(`[ ] UNEXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                    err_count++;
                } else {
                    console.debug(`[X]   EXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(login_redirect)}`);
                }
            } else {
                if (err) {
                    console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                } else {
                    console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(login_redirect)}`);
                    err_count++;
                }
            }

        });
    }
    // loginRedirect
    // ================================================================
    /* END CONFIG METHODS */







    /* BEGIN USER MANAGEMENT METHODS */
    // ================================================================
    // createUser
    single_args[0] = dtb;
    single_args[1] = '';
    testing = ugle_auth.createUser;
    for (let i = 0; i < single_args.length; i++) {


        // args testing
        await testing(dtb, single_args[i], async (err, data) => {
            if (err) {
                console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
            } else {
                console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(data)}`);
                err_count++;
            }
        });


        // subargs testing
        template = {
            'email': 'asuperfakeemail@yahoo.com',
            'password': 'aG00dPa$$word',
            'created_by': 0
        }
        for (const key in template) {
            args = {
                'email': 'asuperfakeemail@yahoo.com',
                'password': 'aG00dPa$$word',
                'created_by': 0
            }

            if (i > 0) {
                args[key] = single_args[i]
            } else if (key == 'email') {
                args.email = 'uglesoft@gmail.com'
            } else if (key == 'password') {
                args.email = 'christian.j.kesler@gmail.com'
            } else if (key == 'created_by') {
                args.email = 'erudtionalism@gmail.com'
            }

            await testing(dtb, args, async (err) => {
                if (i <= 0) {
                    if (err) {
                        console.debug(`[ ] UNEXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                        err_count++;
                    } else {
                        console.debug(`[X]   EXPECTED PASS | ${testing.name}[${i}]`);
                    }
                } else {
                    if (err) {
                        console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                    } else {
                        console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}]`);
                        err_count++;
                    }
                }
            });
        }


        // dtb testing
        await testing(single_args[i], template, async (err) => {
            if (i <= 0) {
                if (err) {
                    console.debug(`[ ] UNEXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                    err_count++;
                } else {
                    console.debug(`[X]   EXPECTED PASS | ${testing.name}[${i}]`);
                }
            } else {
                if (err) {
                    console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                } else {
                    console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}]`);
                    err_count++;
                }
            }
        });


        // callback testing
        await testing(dtb, args, single_args[i]);


    }
    // createUser
    // ================================================================


    // ================================================================
    // readUser
    single_args[0] = 'uglesoft@gmail.com';
    single_args[1] = 'uglesoft@yahoo.com';
    testing = ugle_auth.readUser;
    for (let i = 0; i < single_args.length; i++) {


        // args testing
        await testing(dtb, single_args[i], async (err, data) => {
            if (i <= 0) {
                if (err) {
                    console.debug(`[ ] UNEXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                    err_count++;
                } else {
                    console.debug(`[X]   EXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(data)}`);
                }
            } else {
                if (err) {
                    console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                } else {
                    console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(data)}`);
                    err_count++;
                }
            }
        });


        // dtb testing
        await testing(single_args[i], single_args[0], async (err, data) => {
            if (err) {
                console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
            } else {
                console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(data)}`);
                err_count++;
            }
        });


        // callback testing
        await testing(dtb, single_args[0], single_args[i]);


    }
    // readUser
    // ================================================================


    // ================================================================
    // readUsers
    single_args[0] = 'uglesoft@gmail.com';
    single_args[1] = 'uglesoft@yahoo.com';
    testing = ugle_auth.readUsers;
    for (let i = 0; i < single_args.length; i++) {


        // args testing
        await testing(dtb, single_args[i], async (err, data) => {
            if (i <= 0) {
                if (err) {
                    console.debug(`[ ] UNEXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                    err_count++;
                } else {
                    console.debug(`[X]   EXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(data)}`);
                }
            } else {
                if (err) {
                    console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                } else {
                    console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(data)}`);
                    err_count++;
                }
            }
        });


        // dtb testing
        await testing(single_args[i], single_args[0], async (err, data) => {
            if (err) {
                console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
            } else {
                console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(data)}`);
                err_count++;
            }
        });


        // callback testing
        await testing(dtb, single_args[0], single_args[i]);


    }
    // readUsers
    // ================================================================


    // ================================================================
    // deleteUser
    single_args[0] = 'uglesoft@gmail.com';
    single_args[1] = 'uglesoft@yahoo.com';
    testing = ugle_auth.deleteUser;
    for (let i = 0; i < single_args.length; i++) {


        // args testing
        await testing(dtb, single_args[i], async (err, data) => {
            if (i <= 0) {
                if (err) {
                    console.debug(`[ ] UNEXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                    err_count++;
                } else {
                    console.debug(`[X]   EXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(data)}`);
                }
            } else {
                if (err) {
                    console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                } else {
                    console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(data)}`);
                    err_count++;
                }
            }
        });


        // dtb testing
        await testing(single_args[i], single_args[0], async (err, data) => {
            if (err) {
                console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
            } else {
                console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(data)}`);
                err_count++;
            }
        });


        // callback testing
        await testing(dtb, single_args[0], single_args[i]);


    }
    // deleteUser
    // ================================================================


    // ================================================================
    // allUsers
    single_args[0] = dtb;
    single_args[1] = '';
    testing = ugle_auth.allUsers;
    for (let i = 0; i < single_args.length; i++) {

        // dtb testing
        await testing(single_args[i], async (err, data) => {
            if (i <= 0) {
                if (err) {
                    console.debug(`[ ] UNEXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                    err_count++;
                } else {
                    console.debug(`[X]   EXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(data)}`);
                }
            } else {
                if (err) {
                    console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                } else {
                    console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(data)}`);
                    err_count++;
                }
            }
        });


        // callback testing
        await testing(dtb, single_args[i]);


    }
    // allUsers
    // ================================================================


    // ================================================================
    // changePassword
    single_args[0] = dtb;
    single_args[1] = '';
    testing = ugle_auth.changePassword;
    for (let i = 0; i < single_args.length; i++) {


        // args testing
        await testing(dtb, single_args[i], async (err, data) => {
            if (err) {
                console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
            } else {
                console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(data)}`);
                err_count++;
            }
        });


        // subargs testing
        template = {
            'email': 'uglesoft@gmail.com',
            'password': 'aBetterpassword0!',
        }
        for (const key in template) {
            args = {
                'email': 'uglesoft@gmail.com',
                'password': 'abadpassword',
            }

            if (i > 0) {
                args[key] = single_args[i]
            } else if (key == 'email') {
                args.email = 'uglesoft@gmail.com'
                args.password = 'aBetterpassword0!'
            } else if (key == 'password') {
                args.email = 'uglesoft@gmail.com'
                args.password = 'aMuchBetterpassword0!'
            }

            await testing(dtb, args, async (err) => {
                if (i <= 0) {
                    if (err) {
                        console.debug(`[ ] UNEXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                        err_count++;
                    } else {
                        console.debug(`[X]   EXPECTED PASS | ${testing.name}[${i}]`);
                    }
                } else {
                    if (err) {
                        console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                    } else {
                        console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}]`);
                        err_count++;
                    }
                }
            });
        }


        // dtb testing
        await testing(single_args[i], template, async (err) => {
            if (i <= 0) {
                if (err) {
                    console.debug(`[ ] UNEXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                    err_count++;
                } else {
                    console.debug(`[X]   EXPECTED PASS | ${testing.name}[${i}]`);
                }
            } else {
                if (err) {
                    console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                } else {
                    console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}]`);
                    err_count++;
                }
            }
        });


        // callback testing
        await testing(dtb, args, single_args[i]);


    }
    // changePassword
    // ================================================================
    /* END USER MANAGEMENT METHODS */








    /* BEGIN SESSION MANAGEMENT METHODS */
    // ================================================================
    // login
    single_args[0] = dtb;
    single_args[1] = '';
    testing = ugle_auth.login;
    for (let i = 0; i < single_args.length; i++) {

        // args testing
        await testing(dtb, single_args[i], async (err, data) => {
            if (err) {
                console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
            } else {
                console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(data)}`);
                err_count++;
            }
        });


        // subargs testing
        template = {
            'email': 'uglesoft@gmail.com',
            'password': 'aBetterpassword0!',
        }
        for (const key in template) {
            args = {
                'email': 'uglesoft@gmail.com',
                'password': 'aBetterpassword0!',
            }

            if (i > 0) {
                args[key] = single_args[i]
            }

            await testing(dtb, args, async (err, session) => {
                if (i <= 0) {
                    if (err) {
                        console.debug(`[ ] UNEXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                        err_count++;
                    } else {
                        console.debug(`[X]   EXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(session)}`);
                    }
                } else {
                    if (err) {
                        console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                    } else {
                        console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(session)}`);
                        err_count++;
                    }
                }
            });
        }


        // dtb testing
        await testing(single_args[i], template, async (err) => {
            if (i <= 0) {
                if (err) {
                    console.debug(`[ ] UNEXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                    err_count++;
                } else {
                    console.debug(`[X]   EXPECTED PASS | ${testing.name}[${i}]`);
                }
            } else {
                if (err) {
                    console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                } else {
                    console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}]`);
                    err_count++;
                }
            }
        });


        // callback testing
        await testing(dtb, args, single_args[i]);


    }
    // login
    // ================================================================


    // ================================================================
    // refreshSession
    single_args[0] = dtb;
    single_args[1] = '';
    testing = ugle_auth.refreshSession;
    for (let i = 0; i < single_args.length; i++) {


        // args testing
        await testing(dtb, single_args[i], async (err, data) => {
            if (err) {
                console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
            } else {
                console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(data)}`);
                err_count++;
            }
        });


        // subargs testing
        template = {
            'email': 'uglesoft@gmail.com',
        }
        for (const key in template) {
            args = {
                'email': 'uglesoft@gmail.com',
            }

            if (i > 0) {
                args[key] = single_args[i]
            }

            await testing(dtb, args, async (err, session) => {
                if (i <= 0) {
                    if (err) {
                        console.debug(`[ ] UNEXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                        err_count++;
                    } else {
                        console.debug(`[X]   EXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(session)}`);
                    }
                } else {
                    if (err) {
                        console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                    } else {
                        console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(session)}`);
                        err_count++;
                    }
                }
            });
        }


        // dtb testing
        await testing(single_args[i], template, async (err) => {
            if (i <= 0) {
                if (err) {
                    console.debug(`[ ] UNEXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                    err_count++;
                } else {
                    console.debug(`[X]   EXPECTED PASS | ${testing.name}[${i}]`);
                }
            } else {
                if (err) {
                    console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                } else {
                    console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}]`);
                    err_count++;
                }
            }
        });


        // callback testing
        await testing(dtb, args, single_args[i]);


    }
    // refreshSession
    // ================================================================


    // ================================================================
    // logout
    single_args[0] = {
        'email': 'someuser@outlook.com',
    };
    single_args[1] = '';
    testing = ugle_auth.logout;
    for (let i = 0; i < single_args.length; i++) {

        // args testing
        await testing(single_args[i], (err, session) => {
            if (i <= 0) {
                if (err) {
                    console.debug(`[ ] UNEXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                    err_count++;
                } else {
                    console.debug(`[X]   EXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(session)}`);
                }
            } else {
                if (err) {
                    console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                } else {
                    console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(session)}`);
                    err_count++;
                }
            }

        });


        // callback testing
        await testing(single_args[0], single_args[i]);

    }
    // logout
    // ================================================================
    /* END SESSION MANAGEMENT METHODS */








    /* BEGIN PERMISSION METHODS */
    // ================================================================
    // isLoggedIn
    testing = ugle_auth.isLoggedIn;
    for (let i = 0; i < single_args.length; i++) {

        session_template = {
            'valid': true
        }

        res_template = {
            'redirect': (url) => {
                console.log(url)
            }
        }

        for (const session_key in session_template) {

            session_args = {
                'valid': true
            }

            if (i > 1) {
                session_args[session_key] = single_args[i]
            } else if (i == 1) {
                session_args.valid = false
            }

            if (await testing(session_args, res_template)) {
                if (i > 0) {
                    console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}]`);
                    err_count++;
                } else {
                    console.debug(`[X]   EXPECTED PASS | ${testing.name}[${i}]`);
                }
            } else {
                if (i > 0) {
                    console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}]`);
                } else {
                    console.debug(`[ ] UNEXPECTED FAIL | ${testing.name}[${i}]`);
                    err_count++;
                }
            }
        }

        for (const res_key in res_template) {

            res_args = {
                'redirect': (url) => {
                    console.log(url)
                }
            }

            if (i > 1) {
                res_args[res_key] = single_args[i]
            }

            if (await testing(session_template, res_args)) {
                if (i > 1 && i != 8) {
                    console.log(session_template, JSON.stringify(res_args), i)
                    console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}]`);
                    err_count++;
                } else {
                    console.debug(`[X]   EXPECTED PASS | ${testing.name}[${i}]`);
                }
            } else {
                if (i > 1) {
                    console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}]`);
                } else {
                    console.debug(`[ ] UNEXPECTED FAIL | ${testing.name}[${i}]`);
                    err_count++;
                }
            }
        }
    }
    // isLoggedIn
    // ================================================================


    // ================================================================
    // hasPermission
    single_args[0] = 'user';
    single_args[1] = 'admin';
    testing = ugle_auth.hasPermission;
    for (let i = 0; i < single_args.length; i++) {

        session_template = {
            'valid': true,
            'perms': {
                'admin': false,
                'user': true
            }
        }

        res_template = {
            'redirect': (url) => {
                console.log(url)
            }
        }

        for (const session_key in session_template) {

            session_args = {
                'valid': true,
                'perms': {
                    'admin': false,
                    'user': true
                }
            }

            if (i > 1) {
                session_args[session_key] = single_args[i]
            } else if (i == 1) {
                session_args.valid = false
            }

            if (await testing(session_args, res_template, single_args[i])) {
                if (i > 0) {
                    console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}]`);
                    err_count++;
                } else {
                    console.debug(`[X]   EXPECTED PASS | ${testing.name}[${i}]`);
                }
            } else {
                if (i > 0) {
                    console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}]`);
                } else {
                    console.debug(`[ ] UNEXPECTED FAIL | ${testing.name}[${i}]`);
                    err_count++;
                }
            }
        }

        for (const res_key in res_template) {

            res_args = {
                'redirect': (url) => {
                    console.log(url)
                }
            }

            if (i > 1) {
                res_args[res_key] = single_args[i]
            }

            if (await testing(session_template, res_args, single_args[i])) {
                if (i > 0) {
                    console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}]`);
                    err_count++;
                } else {
                    console.debug(`[X]   EXPECTED PASS | ${testing.name}[${i}]`);
                }
            } else {
                if (i > 0) {
                    console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}]`);
                } else {
                    console.debug(`[ ] UNEXPECTED FAIL | ${testing.name}[${i}]`);
                    err_count++;
                }
            }
        }

        if (await testing(session_template, res_template, single_args[i])) {
            if (i > 0) {
                console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}]`);
                err_count++;
            } else {
                console.debug(`[X]   EXPECTED PASS | ${testing.name}[${i}]`);
            }
        } else {
            if (i > 0) {
                console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}]`);
            } else {
                console.debug(`[ ] UNEXPECTED FAIL | ${testing.name}[${i}]`);
                err_count++;
            }
        }

    }
    // hasPermission
    // ================================================================


    // ================================================================
    // addPermission
    single_args[0] = dtb;
    single_args[1] = '';
    testing = ugle_auth.addPermission;
    for (let i = 0; i < single_args.length; i++) {

        // args testing
        await testing(dtb, single_args[i], async (err, data) => {
            if (err) {
                console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
            } else {
                console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(data)}`);
                err_count++;
            }
        });


        // subargs testing
        template = {
            'email': 'uglesoft@gmail.com',
            'permission': 'developer',
        }
        for (const key in template) {
            args = {
                'email': 'uglesoft@gmail.com',
                'permission': 'developer',
            }

            if (i > 0) {
                args[key] = single_args[i]
            }

            await testing(dtb, args, async (err, session) => {
                if (i <= 0 || args.permission == 'badstring') {
                    if (err) {
                        console.debug(`[ ] UNEXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                        err_count++;
                    } else {
                        console.debug(`[X]   EXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(session)}`);
                    }
                } else {
                    if (err) {
                        console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                    } else {
                        console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(session)}`);
                        err_count++;
                    }
                }
            });
        }


        // dtb testing
        await testing(single_args[i], template, async (err) => {
            if (i <= 0) {
                if (err) {
                    console.debug(`[ ] UNEXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                    err_count++;
                } else {
                    console.debug(`[X]   EXPECTED PASS | ${testing.name}[${i}]`);
                }
            } else {
                if (err) {
                    console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                } else {
                    console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}]`);
                    err_count++;
                }
            }
        });


        // callback testing
        await testing(dtb, args, single_args[i]);


    }
    // addPermission
    // ================================================================



    // ================================================================
    // removePermission
    single_args[0] = dtb;
    single_args[1] = '';
    testing = ugle_auth.removePermission;
    for (let i = 0; i < single_args.length; i++) {

        // args testing
        await testing(dtb, single_args[i], async (err, data) => {
            if (err) {
                console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
            } else {
                console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(data)}`);
                err_count++;
            }
        });


        // subargs testing
        template = {
            'email': 'uglesoft@gmail.com',
            'permission': 'developer',
        }
        for (const key in template) {
            args = {
                'email': 'uglesoft@gmail.com',
                'permission': 'developer',
            }

            if (i > 0) {
                args[key] = single_args[i]
            }

            await testing(dtb, args, async (err, session) => {
                if (i <= 0 || args.permission == 'badstring') {
                    if (err) {
                        console.debug(`[ ] UNEXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                        err_count++;
                    } else {
                        console.debug(`[X]   EXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(session)}`);
                    }
                } else {
                    if (err) {
                        console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                    } else {
                        console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(session)}`);
                        err_count++;
                    }
                }
            });
        }


        // dtb testing
        await testing(single_args[i], template, async (err) => {
            if (i <= 0) {
                if (err) {
                    console.debug(`[ ] UNEXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                    err_count++;
                } else {
                    console.debug(`[X]   EXPECTED PASS | ${testing.name}[${i}]`);
                }
            } else {
                if (err) {
                    console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                } else {
                    console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}]`);
                    err_count++;
                }
            }
        });


        // callback testing
        await testing(dtb, args, single_args[i]);


    }
    // removePermission
    // ================================================================
    /* END PERMISSION METHODS */








    /* BEGIN ADMIN METHODS */
    // ================================================================
    // lockAccount
    single_args[0] = 'uglesoft@gmail.com';
    single_args[1] = 'uglesoft@yahoo.com';
    testing = ugle_auth.lockAccount;
    for (let i = 0; i < single_args.length; i++) {

        // args testing
        await testing(dtb, single_args[i], async (err, data) => {
            if (i <= 0) {
                if (err) {
                    console.debug(`[ ] UNEXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                    err_count++;
                } else {
                    console.debug(`[X]   EXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(data)}`);
                }
            } else {
                if (err) {
                    console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                } else {
                    console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(data)}`);
                    err_count++;
                }
            }
        });


        // dtb testing
        await testing(single_args[i], single_args[0], async (err, data) => {
            if (err) {
                console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
            } else {
                console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(data)}`);
                err_count++;
            }
        });


        // callback testing
        await testing(dtb, single_args[0], single_args[i]);


    }
    // lockAccount
    // ================================================================


    // ================================================================
    // unlockAccount
    single_args[0] = 'uglesoft@gmail.com';
    single_args[1] = 'uglesoft@yahoo.com';
    testing = ugle_auth.unlockAccount;
    for (let i = 0; i < single_args.length; i++) {

        // args testing
        await testing(dtb, single_args[i], async (err, data) => {
            if (i <= 0) {
                if (err) {
                    console.debug(`[ ] UNEXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                    err_count++;
                } else {
                    console.debug(`[X]   EXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(data)}`);
                }
            } else {
                if (err) {
                    console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                } else {
                    console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(data)}`);
                    err_count++;
                }
            }
        });


        // dtb testing
        await testing(single_args[i], single_args[0], async (err, data) => {
            if (err) {
                console.debug(`[X]   EXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
            } else {
                console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(data)}`);
                err_count++;
            }
        });


        // callback testing
        await testing(dtb, single_args[0], single_args[i]);


    }
    // unlockAccount
    // ================================================================
    /* END ADMIN METHODS */








    console.debug();
    console.debug();
    console.debug();
    console.debug();
    console.info(`AUTOMATED TEST COMPLETED: ${err_count} errors found`);
    // console.warn(`FOR MANUAL TESTING, PLEASE NAVIGATE TO http://localhost:3000/auth IN YOUR BROWSER OF CHOICE`)




})();