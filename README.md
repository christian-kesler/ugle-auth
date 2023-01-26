# ugle-auth

An authentication system for NodeJS web apps using sqlite




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
```

Then use the following code in your main.js or index.js file.  It will connect to a .db file at the path provided and setup all the routes needed to handle server authentication.
```javascript
const dotenv = require('dotenv');
dotenv.config();

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

I've taken steps to make this authentication system secure by including account lockout protocols for failed login attempts, sensitive data hashing, manual lockout procedurres, account verification, and more. 


#### Password and Tempkey Hashing

`bcrypt` is used for both hashing passwords and comparing password hashes.  



#### Login Attempts

If a login attempt makes it through all input validation AND finds a valid email but the password hashes do not match, then a `failed_login_attempts` integer is incremented.  If the `failed_login_attempts` for a given email is equal to (or greater than) the `lockout_policy` variable (which is set to 4 by default), login attempts are denied until the password is reset.  




## Setup

### Installation

```bash
npm install ugle-auth
```

### Dependencies

You will probably be able to use this package with older or newer versions than these, but I know these work for sure.  

If you are using the preset routing function:

```javascript
"dependencies": {
    "bcrypt": "^5.1.0",
    "nodemailer": "^6.8.0",
    "sqlite3": "^5.1.2"
    "express": "^4.18.2",
}
```

If you are using custom routing and just want the authentication functions:

```javascript
"dependencies": {
    "bcrypt": "^5.1.0",
    "nodemailer": "^6.8.0",
    "sqlite3": "^5.1.2"
}
```



## Usage

<!-- IMPORTANT - your salt must not change once you enter a production environment; doing so will result in all existing accounts being locked out completely since the stored hashes will have been generated using a different salt than the currently implemented one. -->

```javascript
const ugle_auth = require('ugle-auth');
```

### Function Examples

```javascript

```


### Preset Routes

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

You'll also need a folder titled "auth" for the ejs files that correspond to each route.  An "auth" folder is present within this package, and can be downloaded from GitHub <a href="https://github.com/christian-kesler/ugle-auth/tree/main/views/auth/">here</a>.  If you'd rather make them yourself, these are the files you'll need within your ejs views directory:

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




## Author(s)

Christian J Kesler, Uglesoft LLC &copy;
 
### Acknowledgements

As always, I have ChatGPT to thank for helping me walk through my thought process and teach me new things as I go.  

