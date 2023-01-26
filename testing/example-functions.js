// connectToDatabase
// formatDatabase
// defaultPerms
// lockoutPolicy
// loginRedirect
// createAdmin
// createUser
// readUser
// readUsers
// deleteUser
// allUsers
// changePassword
// login
// refreshSession
// logout
// isLoggedIn
// hasPermission
// lockAccount
// unlockAccount
// addPermission
// removePermission
// sendTempkeyEmail
// verifyUser
// resetPassword


const dotenv = require('dotenv');
dotenv.config();


const ugle_auth = require(`${__dirname}/../index.js`);


req = {
    'session': {
        'email': 'admin.uglesoft@gmail.com',
    },
    'query': {
        'email': 'admin.uglesoft@gmail.com',
        'tempkey': 'somereallylongandrandomstring'
    },
    'body': {
        'password': 'aSuperAwesomeP@ssw0rd',
    },
};

res = {
    'redirect': () => {
        console.log(login_redirect);
    }
};


(async () => {




    path = `${__dirname}/database.db`;
    await ugle_auth.connectToDatabase(path, async (err, dtb) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('connectToDatabase successful');
            global.dtb = dtb;
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




    if (ugle_auth.isLoggedIn(req.session, res)) {
        console.log('isLoggedIn successful');
    }




    if (ugle_auth.hasPermission(req.session, res, 'user')) {
        console.log('hasPermission successful');
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




})();