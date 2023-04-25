# ugle-auth

An authentication system for NodeJS web apps using sqlite

![ugle-auth icon](https://raw.githubusercontent.com/Uglesoft/ugle-auth/main/ICON.png)

## Quickstart

Install using this command:

```bash
npm install ugle-auth
```

Create two files using the command below:
```bash
touch .env
touch database.db
```

Use the following format to substitue your information in the `.env` file:
```javascript
EMAIL_SENDER = "myawesomecompany@gmail.com"
EMAIL_DOMAIN = "gmail"
EMAIL_TOKEN = "abcdefghijklmnop"

AUTH_SALT = "A cool and hard to guess salt"

WEBAPP_DOMAIN = "https://myawesomecompany.com"

ADMIN_EMAIL = "myawesomecompany@gmail.com"
ADMIN_PASSWORD = "MyAwesomeP@ssw0rd"
```

Then use the following code in your `main.js` or `index.js` file.  It will connect to a `.db` file at the path provided and setup all the routes needed to handle server authentication.
```javascript
const dotenv = require('dotenv');
dotenv.config();

const ugle_auth = require('ugle-auth');
ugle_auth.connectToDatabase(`${__dirname}/database.db`, (err, dtb) => {
    if (err) {
        console.error(err.message);
    } else {
        ugle_auth.routes(app, dtb);
    }
})
```



## Overview

There are two ways to use ugle-auth:

- You can call our predefined route function and let the package do all the work, or...
- You can call individual functions inside custom routing.


### Security

I've taken steps to make this authentication system secure by including account lockout protocols for failed login attempts, sensitive data hashing, manual lockout procedurres, account verification, and more. 


#### Password and Tempkey Hashing

The hashing algorithm used for passwords is below, and relies on the argon2 package for NodeJS:

```javascript
hash = await argon2.hash(password, {
    timeCost: 16,
    memoryCost: 128 * 1024,
    parallelism: 2
})
```


These settings are intended to balance security and performance.  Tempkeys are generated using the following algorithm:

```javascript
crypto.pbkdf2(crypto.randomBytes(256).toString('hex'), crypto.randomBytes(256).toString('hex'), 999999, 255, 'sha512', (err, derivedKey) => {
    if (err) reject(err);
    resolve(derivedKey.toString('hex'));
});
```

Which is meant to be long, complex, and utterly random.  While a single randomBytes function may have sufficed, even random functions have some predictability that can be exploited.  Hashing two large random strings a large number of times is meant to be the solution to that vulnerability.  




#### Login Attempts

If a login attempt makes it through all input validation AND finds a valid email but the password hashes do not match, then a `failed_login_attempts` integer is incremented.  If the `failed_login_attempts` for a given email is equal to (or greater than) the `lockout_policy` variable (which is set to 4 by default), login attempts are denied until the password is reset.  




## Setup

### Installation

```bash
npm install ugle-auth
```

### Dependencies

You will probably be able to use this package with older or newer versions than these, but I know these work for sure.  

```javascript
"dependencies": {
    "argon2": "^0.30.3",
    "bcrypt": "^5.1.0",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "nodemailer": "^6.8.0",
    "sqlite3": "^5.1.2"
}
```




## Usage

<!-- IMPORTANT - your salt must not change once you enter a production environment; doing so will result in all existing accounts being locked out completely since the stored hashes will have been generated using a different salt than the currently implemented one. -->

```javascript
const ugle_auth = require('ugle-auth');
```

### Preset Routing

```javascript 
// env variables
const dotenv = require('dotenv');
dotenv.config();


// app initialization
const express = require('express');
const app = express();


// session configuration
const session = require('express-session');
app.use(
    session({
        cookie: {
            // httpOnly: true,
            // secure: true,
            // sameSite: true,
            maxAge: 500 * 60 * 1000,
            // expires: 5 * 60 * 1000,
        },
        resave: true,
        saveUninitialized: true,
        secret: 'secret',
        secure: true,
    })
);

// body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ejs view engine
const path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/../views'));




// ugle-auth functions
const ugle_auth = require('ugle-auth');
ugle_auth.connectToDatabase(`${__dirname}/database.db`, (err, dtb) => {
    if (err) {
        console.error(err.message);
    } else {


        // setting up database
        ugle_auth.setupDatabase(dtb, (err) => {
            if (err) {
                console.error(err.message)
            } else {
                console.info('database setup complete')
            }

        })


        // creating default admin account
        args = {
            'email': process.env.ADMIN_EMAIL,
            'password': process.env.ADMIN_PASSWORD,
            'created_by': 0
        }
        ugle_auth.createAdmin(dtb, args, (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.info('default admin created')
            }
        })


        // activating preset routing
        ugle_auth.routes(app, dtb);


        // listening on development port
        app.listen(3000);
        console.log('listening on port 3000');

    }
});
```

If you use the preset routing function, these are the endpoints that will be available on your server:

```
/auth                           GET 
/auth/signup                    GET & POST
/auth/login                     GET & POST
/auth/logout                    GET & POST
/auth/forgot-password           GET & POST
/auth/reset-password            GET & POST
/auth/refresh-session           GET
/auth/change-password           GET & POST
/auth/request-verification      GET & POST
/auth/confirm-verification      GET
/auth/delete-account            GET & POST
/auth/lock-account              GET & POST
/auth/unlock-account            GET & POST
/auth/add-permission            GET & POST
/auth/remove-permission         GET & POST
```

You'll also need a folder titled "auth" for the ejs files that correspond to each route.  An "auth" folder is present within this package, and can be downloaded from GitLab <a href="https://gitlab.com/uglesoft/openware/ugle-auth/-/tree/main/views/auth">here</a>.  If you'd rather make them yourself, these are the files you'll need within your ejs views directory:

```
auth/
    admin/
        add-permission.ejs
        lock-account.ejs
        remove-permission.ejs
        unlock-account.ejs
    layout/
        auth_begin.ejs
        auth_end.ejs
        messages.ejs
    change-password.ejs
    delete-account.ejs
    forgot-password.ejs
    login.ejs
    logout.ejs
    request-verification.ejs
    reset-password.ejs
    signup.ejs
    verify-request.ejs
```




### Function Examples

```javascript
path = `${__dirname}/database.db`;
await ugle_auth.connectToDatabase(path, async (err, dtb) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('connectToDatabase successful');
        global.dtb = dtb;
    }
});




await ugle_auth.setupDatabase(dtb, async (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('setupDatabase successful');
    }
});




await ugle_auth.formatDatabase(dtb, async (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('formatDatabase successful');
    }
});




perms = {
    'admin': false,
    'user': true
};
await ugle_auth.defaultPerms(perms, async (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('defaultPerms successful');
    }
});




attempts = 8;
await ugle_auth.lockoutPolicy(attempts, async (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('lockoutPolicy successful');
    }
});




url = '/auth/login';
await ugle_auth.loginRedirect(url, async (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('loginRedirect successful');
    }
});




args = {
    'email': 'admin.uglesoft@gmail.com',
    'password': 'P@ssw0rd',
    'created_by': 0
};
await ugle_auth.createAdmin(dtb, args, async (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('createAdmin successful');
    }
});




args = {
    'email': 'user.uglesoft@gmail.com',
    'password': 'P@ssw0rd',
    'created_by': 0
};
await ugle_auth.createUser(dtb, args, async (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('createUser successful');
    }
});




email = 'admin.uglesoft@gmail.com';
await ugle_auth.readUser(dtb, email, async (err, data) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('readUser successful');
        console.log(data);
    }
});




email = 'admin.uglesoft@gmail.com';
await ugle_auth.readUsers(dtb, email, async (err, data) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('readUsers successful');
        console.log(data);
    }
});




email = 'admin.uglesoft@gmail.com';
await ugle_auth.deleteUser(dtb, email, async (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('deleteUser successful');
    }
});




await ugle_auth.allUsers(dtb, async (err, data) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('allUsers successful');
        console.log(data);
    }
});




args = {
    'email': 'user.uglesoft@gmail.com',
    'password': 'NewP@ssw0rd',
};
await ugle_auth.changePassword(dtb, args, async (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('changePassword successful');
    }
});




args = {
    'email': 'user.uglesoft@gmail.com',
    'password': 'NewP@ssw0rd',
};
await ugle_auth.login(dtb, args, async (err, session) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('login successful');
        console.log(session);
        req.session = session;
    }
});




await ugle_auth.refreshSession(dtb, req.session, async (err, session) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('refreshSession successful');
        console.log(session);
        req.session = session;
    }
});




await ugle_auth.logout(req.session, async (err, session) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('logout successful');
        console.log(session);
        req.session = session;
    }
});




if (ugle_auth.navSession(req.session, res)) {
    console.log('navSession successful');
}




if (ugle_auth.navSessionUnverified(req.session, res)) {
    console.log('navSessionUnverified successful');
}




if (ugle_auth.apiSession(req.session, res)) {
    console.log('apiSession successful');
}




if (ugle_auth.apiSessionUnverified(req.session, res)) {
    console.log('apiSessionUnverified successful');
}




if (ugle_auth.navPermission(req.session, res, 'user')) {
    console.log('navPermission successful');
}




if (ugle_auth.apiPermission(req.session, res, 'user')) {
    console.log('apiPermission successful');
}




email = 'user.uglesoft@gmail.com';
await ugle_auth.lockAccount(dtb, email, async (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('lockAccount successful');
    }
});




email = 'user.uglesoft@gmail.com';
await ugle_auth.unlockAccount(dtb, email, async (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('unlockAccount successful');
    }
});




args = {
    'email': 'user.uglesoft@gmail.com',
    'permission': 'developer',
};
await ugle_auth.addPermission(dtb, args, async (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('addPermission successful');
    }
});




args = {
    'email': 'user.uglesoft@gmail.com',
    'permission': 'developer',
};
await ugle_auth.removePermission(dtb, args, async (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('removePermission successful');
    }
});




args = {
    'recipient': 'example@gmail.com',
    'subject': 'Requested Account Verification Link',
    'text': `=== Account Verification Link === Please copy and paste this link into your browser to verify your account: ${process.env.WEBAPP_DOMAIN}/auth/confirm-verification?tempkey=`,
    'html': `<h4>Account Verification Link</h4><p>Please click the link below to verify your account.</p><a href="${process.env.WEBAPP_DOMAIN}/auth/confirm-verification?tempkey=">Verify My Account</a>`
};
await ugle_auth.sendTempkeyEmail(dtb, args, async (err, data) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('sendTempkeyEmail successful');
        console.log(data);
    }
});




var args = {
    'email': 'user.uglesoft@gmail.com',
    'tempkey': req.query.tempkey,
};
await ugle_auth.verifyUser(dtb, args, async (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('verifyUser successful');
    }
});




args = {
    'email': req.query.email,
    'tempkey': req.query.tempkey,
    'password': req.body.password
};
await ugle_auth.resetPassword(dtb, args, async (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('resetPassword successful');
    }
});
```




## Author(s)

Christian J Kesler, Uglesoft Openware &copy;
 
### Acknowledgements

As always, I have ChatGPT to thank for helping me walk through my thought process and teach me new things as I go.  

