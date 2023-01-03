# ugle-auth

An authentication system for NodeJS web apps using sqlite




## Quickstart

Create a .env file in the following format and substitute with your information:
```
EMAIL_SENDER = "myawesomecompany@gmail.com"
EMAIL_DOMAIN = "gmail"
EMAIL_TOKEN = "abcdefghijklmnop"

AUTH_SALT = "A cool and hard to guess salt"

WEBAPP_DOMAIN = "https://myawesomecompany.com"
```

Then use the following code in your main.js or index.js file.  It will connect to a .db file at the path provided and setup all the routes needed to handle server authentication.
```
const ugle_auth = require('ugle-auth');

ugle_auth.initDtb(`${__dirname}/database.db`, (err, dtb) => {
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

I've taken steps to make this package secure, including account lcokout protocols, sensitive data hashing, and more. 


#### Password and Tempkey Hashing

The hashing algorithm used is below, and relies on the built-in crypto package for NodeJS:

```
pbkdf2Sync(input, salt, 999999, 255, `sha512`).toString(`hex`)
```

As you can see, it hashes to a 255 character output (a convenient number for SQLite) and iterates 999,999 times with a custom salt determined by you.  As far as I can tell, this hash will be more than adequate for securing the passwords of your users.  The standard I see others recommend is 10,000 iterations with 64 characters, and I prefer a bit of overkill when it comes to cybersecurity.

The Tempkeys are handled the same way, but using totally randomized input and salt each time.  There is no known reliable way to guess what a Tempkey will be before it is created, and they are only created when they are about to be used for a specific purpose.


#### Login Attempts

If a login attempt makes it through all input validation AND finds a valid email but the password hashes do not match, then a failed_login_attempts integer is incremented.  If the failed_login_attempts for a given email is equal to 4 or greater, login attempts are denied until the password is reset.  




## Setup

### Installation

```
npm install ugle-auth
```

### Dependencies

You will probably be able to use this package with older or newer versions than these, but I know these work for sure.  

If you are using the preset routing function:

```
"dependencies": {
    "nodemailer": "^6.8.0",
    "sqlite3": "^5.1.2"
    "dotenv": "^16.0.3",
    "ejs": "^3.1.8",
    "express": "^4.18.2",
}
```

If you are using custom routing and just want the authentication functions:

```
"dependencies": {
    "nodemailer": "6.8.0",
    "sqlite3": "5.1.2"
}
```



## Usage

IMPORTANT - your salt must not change once you enter a production environment; doing so will result in all existing accounts being locked out completely since the stored hashes will have been generated using a different salt than the currently implemented one.

```
const ugle_auth = require('ugle-auth');
```

### Function Examples

```

// CONNECT to a database file
await ugle_auth.initDtb('./database.db', (err, dtb) => {
    if (err) {
        console.log(err.message);
    } else {
        // do something with dtb connection
    }
})


// CREATE new user account
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
}
await ugle_auth.createUser(dtb, args, (err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log(`createUser successful`);
    }
});


// READ existing user account(s)
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
await ugle_auth.readUsers(dtb, args, (err, data) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log(`readUser successful | ${JSON.stringify(data)}`);
    }
});


// UPDATE existing user account
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


// DELETE existing user account
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


// LOGIN to user account
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


// LOGOUT of user account
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


// List all user accounts
await ugle_auth.allUsers(dtb, (err, data) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log(JSON.stringify(data));
    }
});

```


### Preset Routes

If you use the preset routing function, these are the endpoints that will be available on your server:

```
/auth
/auth/signup
/auth/login
/auth/logout
/auth/forgot-password
/auth/change-password
/auth/verify
/auth/verify-request
/auth/verify-confirm
```

You'll also need a folder titled "auth" for the ejs files that correspond to each route.  An "auth" folder is present within this package, and can be downloaded from GitHub <a href="https://github.com/christian-kesler/ugle-auth/tree/main/views/auth/">here</a>.  If you'd rather make them yourself, these are the files you'll need within your ejs views directory:

```
auth/
    change-password.ejs
    forgot-password.ejs
    login.ejs
    logout.ejs
    signup.ejs
    verify-request.ejs
```




## Author(s)

Christian J Kesler, Uglesoft LLC &copy;
 
### Acknowledgements

As always, I have ChatGPT to thank for helping me walk through my thought process and teach me new things as I go.  

