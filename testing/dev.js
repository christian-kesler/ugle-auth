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
                    console.debug(`[X] EXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(dtb)}`);
                    dtb.exec('DROP TABLE IF EXISTS auth;');
                    dtb.exec('DROP TABLE IF EXISTS auth_archive;');
                    dtb.exec('DROP TABLE IF EXISTS auth_log;');
                    global.dtb = dtb;
                }
            } else {
                if (err) {
                    console.debug(`[X] EXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                } else {
                    dtb.exec('DROP TABLE IF EXISTS auth;');
                    dtb.exec('DROP TABLE IF EXISTS auth_archive;');
                    dtb.exec('DROP TABLE IF EXISTS auth_log;');
                    global.dtb = dtb;
                    console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(dtb)}`);
                    err_count++;
                }
            }

        });
    }
    // connectToDatabase
    // ================================================================


    await dtb.exec(
        `CREATE TABLE IF NOT EXISTS auth(
    'id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'email' VARCHAR(255) UNIQUE,
    
    'hash' VARCHAR(255),
    'status' VARCHAR(255),
    'perms' TEXT,

    'tempkey' VARCHAR(255),
    'tempkey_datetime' DATETIME,
    'failed_login_attempts' INTEGER,

    'created_at' DATETIME,
    'created_by' VARCHAR(255)
    );`
    );


    ugle_auth.loginRedirect('/auth/login');

    await ugle_auth.createUser(dtb, {
        'email': 'uglesoft@gmail.com',
        'password': 'password',
        'created_by': 87
    }, (err) => {
        console.log(err)
    })




    // TODO login
    // ================================================================
    // login
    single_args[0] = 'user';
    single_args[1] = 'admin';
    testing = ugle_auth.login;
    for (let i = 0; i < single_args.length; i++) {

        args_template = {
            'email': '',
            'password': ''
        }

        for (const key in args_template) {

            login_args = {
                'email': 'uglesoft@gmail.com',
                'password': 'password'
            }

            if (i > 1) {
                login_args[key] = single_args[i]
            }

            await testing(dtb, login_args, async (err, session) => {
                if (i <= 0) {
                    if (err) {
                        console.debug(`[ ] UNEXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                        err_count++;
                    } else {
                        console.debug(`[X] EXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(session)}`);
                    }
                } else {
                    if (err) {
                        console.debug(`[X] EXPECTED FAIL | ${testing.name}[${i}] | ${err.message}`);
                    } else {
                        console.debug(`[ ] UNEXPECTED PASS | ${testing.name}[${i}] | ${JSON.stringify(session)}`);
                        err_count++;
                    }
                }
            });
        }
    }
    // login
    // ================================================================


    console.debug();
    console.debug();
    console.debug();
    console.debug();
    console.info(`AUTOMATED TEST COMPLETED: ${err_count} errors found`);
    // console.warn(`FOR MANUAL TESTING, PLEASE NAVIGATE TO http://localhost:3000/auth IN YOUR BROWSER OF CHOICE`)




})();