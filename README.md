# ugle-auth

An authentication system for NodeJS web apps using sqlite


## Installation

    npm install ugle-auth


## Overview

There are two ways to use ugle-auth:

- You can call our predefined route function and let the package do all the work, 
- You can call individual functions inside custom routing.

We'll walk through both below.

## Dependencies

You will probably be able to use this package with older or newer versions than these, but I know these work for sure.  


### Preset Routing 

    "dependencies": {
        "nodemailer": "^6.8.0",
        "sqlite3": "^5.1.2"
        "dotenv": "^16.0.3",
        "ejs": "^3.1.8",
        "express": "^4.18.2",
    }

You will also need a .env file that looks like the following


    RECIPIENT = "example@gmail.com"

    EMAIL_SENDER = "automated@company.com"
    EMAIL_DOMAIN = "company"
    EMAIL_TOKEN = "eqf8416581a684f698aqwef"

    AUTH_SALT = "A Cool Salt String"

    WEBAPP_DOMAIN = "https://company.com"


### Custom Routing

    "dependencies": {
        "nodemailer": "6.8.0",
        "sqlite3": "5.1.2"
    }


## Usage 

IMPORTANT - your salt must not change once you enter a production environment; doing so will result in all existing accounts being locked out completely since the stored hashes will have been generated using a different salt than the currently implemented one.


### Loading package

    const ugle_auth = require('ugle-auth')


### Connection to Database with Preset Routing

    ugle_auth.initDtb(`${__dirname}/test.db`, (err, dtb) => {
        if (err) {
            console.error(err.message);
        } else {
            ugle_auth.routes(app, dtb);
        }
    })


### Connecting to Database

    await ugle_auth.initDtb('./database.db', (err, dtb) => {
        if (err) {
            console.log(err.message);
        } else {
            // do something with dtb connection
        }
    })


### Preset Routes

    /auth
    /auth/signup
    /auth/login
    /auth/logout
    /auth/forgot-password
    /auth/change-password
    /auth/verify
    /auth/verify/request
    /auth/verify/confirm


### Custom Routing Functions

#### CREATE New User Account

    args = {
        'create_params': {
            'email': req.body.email,
            'password': req.body.password,
            'salt': process.env.AUTH_SALT,
            'perms': {
                'admin': false,
                'user': true,
            },
            'created_at': `${new Date}`,
            'created_by': `${req.session.email}`,
        }
    },

    await ugle_auth.createUser(dtb, args, (err) => {
        if (err) {
            console.log(err.message);
        } else {
            console.log(`createUser successful`);
        }
    });


#### READ Existing User Account

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


#### UPDATE Existing User Account

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


#### DELETE Existing User Account

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


#### Login to User Account

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


#### Logout of User Account

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


#### List All User Accounts

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

If a login attempt makes it through all input validation AND finds a valid email but the password hashes do not match, then a failed_login_attempts integer is incremented.  If the failed_login_attempts for a given email is equal to 4 or greater, login attempts are denied until the password is reset.  


### Password Reset

This is currently in the developers hands, but the tempkey field will help with that.  When updating a user's tempkey field, it will hash in any value you provide other than FALSE.  The intent is to offer a secure non password string to use as a url parameter towards a reset password page.

One recommended way to approach this would be as follows:

User attempts to Login too many times -> User clicks 'Reset Password' (which creates a random tempkey on the User's account and sends an email with the tempkey included as a url parameter within the reset password link) -> User receives an email and clicks the reset password link -> User enters their new password (which updates the User's hash, reseting the login attempts)

A more locked down version might look like

Admin Logs in -> Admin Views all Users -> Admin selects User that is Locked Out -> Admin selects 'Send User Reset Password Email' (updates user's tempkey and uses it to generate reset password link in email) -> User receives email and opens link -> User enters new password (updates user's hash, which resets the login attempt counter) -> User logs in successfully
