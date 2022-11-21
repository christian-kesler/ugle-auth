# ugle-auth

An authentication package by Uglesoft

## Installation

    npm install ugle-auth

## Dependencies

    "dependencies": {
        "express": "^4.18.2",
        "express-session": "^1.17.3",
        "sqlite": "^4.1.2",
        "sqlite3": "^5.1.2",
    }

## Usage

ugle-auth will handle the session variables for you, but first, you need to configure your express app to utilize express-session.  

### Function inputs

IMPORTANT - your salt must not change once you enter a production environment; doing so will result in all existing accounts being locked out completely since the stored hashes will have been generated using a different salt than the currently implemented one.

    ugle_auth.register(sqlite_db, express_req, hashing_salt);
    ugle_auth.login(sqlite_db, express_req, hashing_salt);
    ugle_auth.logout(express_req);

### express & express-session configuration

    const express = require('express');
    const session = require('express-session');
    const sqlite3 = require('sqlite3').verbose();

    (async () => {
        const app = await express()
        const database = await new sqlite3.Database(__dirname + '/your-database.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) console.log(err.message)
        })

        app.use(
            session({
                cookie: {
                    sameSite: true,
                    maxAge: 5 * 60 * 1000,
                },
                resave: true,
                saveUninitialized: true,
                secret: 'your-secret-here',
                secure: true,
            })
        );
    });

### Loading package

    const ugle_auth = require('ugle-auth')

### Register a new account - example routing

Note - the following examples assume your express app is using a view engine such as EJS

    // register
    app.post('/auth/register', async function (req, res) {

        (async () => {
            var result = await ugle_auth.register(database, req)

            if (result.valid) {
                res.redirect('/auth/login?redirect=registration-successful')
            } else {
                console.log(result.message)
                res.render('content/auth/register', {
                    msg_warning: result.message,
                });
            }
        })()

    });

### Login to an existing account - example routing

    // login
    app.post('/auth/login', function (req, res) {

        (async () => {
            var result = await ugle_auth.login(database, req)

            if (result.valid) {
                res.redirect('/account/home')
            } else {
                console.log(result.message)
                res.render('content/auth/login', {
                    msg_warning: result.message,
                });
            }
        })()

    });

### Logout of an existing session - example routing

    // logout
    app.post('/auth/logout', function (req, res) {
        (async () => {
            await ugle_auth.logout(req)

            res.redirect('/auth/login?redirect=logout');
        })()
    });


## Security

### Variable instantiation and deletion

I've made an effort to delete any and all variables used within this package before returning a response.

### Password Hashing

The hashing algorithm used is below:

    return crypto.pbkdf2Sync(input, salt, 1000000, 255, `sha512`).toString(`hex`)

As you can see, it hashes to a 255 character output (a convenient number for SQLite) and iterates 1 million times with a custom salt determined by you.  As far as I can tell, this hash will be more than adequate for securing the passwords of your users.  The standard I see others recommend is 10,000 iterations with 64 characters, and I prefer a bit of overkill when it comes to cybersecurity.

### Login Attempts

There is currently no limit on the quantity or frequency of login attempts; I intend to implement this feature in the future.  