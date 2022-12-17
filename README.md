# ugle-auth

An authentication package by Uglesoft


## Installation

    npm install ugle-auth

## Dependencies

You will probably be able to use this package with older or newer versions than these, but I know these work for sure.  

    "dependencies": {
        "express": "4.18.2",
        "express-session": "1.17.3",
        "sqlite": "4.1.2",
        "sqlite3": "5.1.2",
    }

## Usage

ugle-auth will handle the session variables for you, but first, you need to configure your express app and utilize express-session.  

### Function inputs

IMPORTANT - your salt must not change once you enter a production environment; doing so will result in all existing accounts being locked out completely since the stored hashes will have been generated using a different salt than the currently implemented one.

### express & express-session configuration

    const express = require('express');
    const session = require('express-session');
    const sqlite3 = require('sqlite3').verbose();

    (async () => {
        const app = await express()
        const database = await new sqlite3.Database(
            __dirname + '/your-database.db',
            sqlite3.OPEN_READWRITE,
            (err) => {
                if (err) console.log(err.message)
            }
        )

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

Note - the following examples assume your express app is using a view engine such as EJS, and an environment variable solution such as 'dotenv'

    // register
    app.post('/auth/register', async (req, res) => {

        args = {
            'create_fields': 'email, hash, created_at, created_by',
            'create_params': {                
                'email': req.body.email,
                'password': req.body.password,
                'salt': process.env.AUTH_SALT,
                'created_at': `${new Date}`,
                'created_by': req.session.email,
            }
        }

        ugle_auth.createUser(dtb, args, (err) => {
            if (err) {
                console.log(err.message);
            } else {
                res.redirect('/auth/login?redirect=registration-successful')
            }
        });

    });

### Login to an existing account - example routing

    // login
    app.post('/auth/login', (req, res) => {

        args = {
            'login_params': {
                'email': req.body.email,
                'password': req.body.password,
                'salt': process.env.AUTH_SALT,
            },
            'session': req.session
        }

        ugle_auth.loginUser(dtb, args, (err, session) => {
            if (err) {
                console.log(err.message);
            } else {
                req.session = session;
                res.redirect('/account/home');
            }
        });

    });

### Logout of an existing session - example routing

    // logout
    app.post('/auth/logout', (req, res) => {

        ugle_auth.logoutUser(logoutUser_args[i], (err, data) => {
            if (err) {
                console.log(err.message);
            } else {
                res.redirect('/auth/login?redirect=logout');
            }
        });

    });


## Security

### Password Hashing

The hashing algorithm used is below, and relies on the built-in crypto package for NodeJS:

    pbkdf2Sync(input, salt, 999999, 255, `sha512`).toString(`hex`)

As you can see, it hashes to a 255 character output (a convenient number for SQLite) and iterates 999,999 times with a custom salt determined by you.  As far as I can tell, this hash will be more than adequate for securing the passwords of your users.  The standard I see others recommend is 10,000 iterations with 64 characters, and I prefer a bit of overkill when it comes to cybersecurity.

### Login Attempts

There is currently no limit on the quantity or frequency of login attempts; I intend to implement this feature in the future.  