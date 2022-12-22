# ugle-auth

An authentication package by Uglesoft


## TODO

Develop tempkey functions
Login attempt tracker


## Installation

    npm install ugle-auth


## Dependencies

You will probably be able to use this package with older or newer versions than these, but I know these work for sure.  

    "dependencies": {
        "sqlite3": "5.1.2",
    }


## Usage

IMPORTANT - your salt must not change once you enter a production environment; doing so will result in all existing accounts being locked out completely since the stored hashes will have been generated using a different salt than the currently implemented one.


### Loading package

    const ugle_auth = require('ugle-auth')


### Connecting to Database

    await ugle_auth.initDtb('./database.db', (err, dtb) => {
        if (err) {
            console.log(err.message);
        } else {
            global.dtb = dtb;
        }
    })


### CREATE New User Account

    args = {
        'create_fields': 'email, hash, created_at, created_by',
        'create_params': {
            'email': 'uglesoft@gmail.com',
            'password': 'uglesoftPassword',
            'salt': 'uglesoftSalt',
            'created_at': 'This Exact Moment',
            'created_by': 'The Supreme Owl Tester',
        }
    }

    await ugle_auth.createUser(dtb, args, (err) => {
        if (err) {
            console.log(err.message);
        } else {
            console.log(`createUser successful`);
        }
    });


### READ Existing User Account

    args = {
        'read_fields': 'id, email, created_at, created_by',
        'read_key': 'id',
        'read_value': '1',
    }

    await ugle_auth.readUser(dtb, args, (err, data) => {
        if (err) {
            console.log(err.message);
        } else {
            console.log(`readUser successful | ${JSON.stringify(data)}`);
        }
    });


### UPDATE Existing User Account

    args = {
        'update_field': 'hash',
        'update_params': {
            'data': 'new_password',
            'salt': 'exampleSalt',
        },
        'update_key': 'email',
        'update_value': 'uglesoft@gmail.com'
    }

    await ugle_auth.updateUser(dtb, args, (err, changes) => {
        if (err) {
            console.log(err.message);
        } else {
            console.log(`updateUser successful | ${changes.message}`);
        }
    });


### DELETE Existing User Account

    args = {
        'delete_key': 'id',
        'delete_value': '1'
    }

    await ugle_auth.deleteUser(dtb, args, (err, changes) => {
        if (err) {
            console.log(err.message);
        } else {
            console.log(`deleteUser successful | ${changes.message}`);
        }
    });


### Login to User Account

    global.session = {}

    args = {
        'login_params': {
            'email': 'christian.j.kesler@gmail.com',
            'password': 'personalPassword',
            'salt': 'personalSalt',
        },
        'session': session
    }

    await ugle_auth.loginUser(dtb, args, (err, session) => {
        if (err) {
            console.log(err.message);
        } else {
            global.session = session;
            console.log(`loginUser successful | ${JSON.stringify(session)}`);
        }
    });


### Logout of User Account

    global.session = { "email": "uglesoft@gmail.com", "id": 1 }

    args = {
        'session': session
    }

    await ugle_auth.logoutUser(args, (err, session) => {
        if (err) {
            console.log(err.message);
        } else {
            global.session = session;
            console.log(`logoutUser successful | ${JSON.stringify(session)}`);
        }
    });


### List All User Accounts

    await ugle_auth.allUsers(dtb, (err, data) => {
        if (err) {
            console.log(err.message);
        } else {
            console.log(JSON.stringify(data));
        }
    });


## Security


### Password Hashing

The hashing algorithm used is below, and relies on the built-in crypto package for NodeJS:

    pbkdf2Sync(input, salt, 999999, 255, `sha512`).toString(`hex`)

As you can see, it hashes to a 255 character output (a convenient number for SQLite) and iterates 999,999 times with a custom salt determined by you.  As far as I can tell, this hash will be more than adequate for securing the passwords of your users.  The standard I see others recommend is 10,000 iterations with 64 characters, and I prefer a bit of overkill when it comes to cybersecurity.


### Login Attempts

There is currently no limit on the quantity or frequency of login attempts; I intend to implement this feature in the future.  