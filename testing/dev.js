const dotenv = require('dotenv');
dotenv.config();


const ugle_auth = require(`${__dirname}/../index.js`);




/* 
    The console output will begin with [X] EXPECTED if the behavior is expected and [ ] UNEXPECTED if the behavior is unexpected.
 
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
];

object_args = [
    // valid of correct type | blank
    {},
    // invalid of correct type | blank
    {},
    // empty string
    {
        'sample': 'badstring',
    },
    // integer
    {
        'sample': 8,
    },
    // object
    {
        'sample': {},
    },
    // array
    {
        'sample': [],
    },
    // null
    {
        'sample': null,
    },
    // undefined
    {
        'sample': undefined,
    },
];


(async () => {

    ugle_auth.loginRedirect('/auth/login');

    // TODO logout
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
                // console.log(url)
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

            // console.log();
            // console.log(session_args, res_template, single_args[i]);
            if (await testing(session_args, res_template, single_args[i])) {
                if (i > 0) {
                    console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}]`);
                    err_count++;
                } else {
                    console.debug(`[X] EXPECTED PASS | ${testing.name}[${i}]`);
                }
            } else {
                if (i > 0) {
                    console.debug(`[X] EXPECTED FAIL | ${testing.name}[${i}]`);
                } else {
                    console.debug(`[ ] UNEXPECTED FAIL | ${testing.name}[${i}]`);
                    err_count++;
                }
            }
        }

        for (const res_key in res_template) {

            res_args = {
                'redirect': (url) => {
                    // console.log(url)
                }
            }

            if (i > 1) {
                res_args[res_key] = single_args[i]
            }

            // console.log();
            // console.log(session_template, res_args, single_args[i]);
            if (await testing(session_template, res_args, single_args[i])) {
                if (i > 0) {
                    console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}]`);
                    err_count++;
                } else {
                    console.debug(`[X] EXPECTED PASS | ${testing.name}[${i}]`);
                }
            } else {
                if (i > 0) {
                    console.debug(`[X] EXPECTED FAIL | ${testing.name}[${i}]`);
                } else {
                    console.debug(`[ ] UNEXPECTED FAIL | ${testing.name}[${i}]`);
                    err_count++;
                }
            }
        }

        // console.log();
        // console.log(session_template, res_template, single_args[i]);
        if (await testing(session_template, res_template, single_args[i])) {
            if (i > 0) {
                console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}]`);
                err_count++;
            } else {
                console.debug(`[X] EXPECTED PASS | ${testing.name}[${i}]`);
            }
        } else {
            if (i > 0) {
                console.debug(`[X] EXPECTED FAIL | ${testing.name}[${i}]`);
            } else {
                console.debug(`[ ] UNEXPECTED FAIL | ${testing.name}[${i}]`);
                err_count++;
            }
        }

    }
    // hasPermission
    // ================================================================

    console.debug();
    console.debug();
    console.debug();
    console.debug();
    console.info(`AUTOMATED TEST COMPLETED: ${err_count} errors found`);
    // console.warn(`FOR MANUAL TESTING, PLEASE NAVIGATE TO http://localhost:3000/auth IN YOUR BROWSER OF CHOICE`)




})();