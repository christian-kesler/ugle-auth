const ugle_auth = require(`${__dirname}/handlers.js`);


function validSession(session, res) {
    try {
        if (
            session.email == null ||
            session.id == null ||
            session.perms == null
        ) {
            res.redirect('/auth/login?msg=invalid-session');
            return false;
        } else {
            return true;
        }
    } catch (err) {
        console.log(err.message);
        return false;
    }

}


module.exports = function (app, dtb) {

    app.get('/auth', (req, res) => {
        try {
            if (validSession(req.session, res)) {
                res.redirect('/account/home');
            }
        } catch (err) {
            console.log(err.message);
            res.redirect('/?msg=server-error');
        }
    });




    // signup
    app.get('/auth/signup', (req, res) => {
        try {
            res.render('auth/signup', {
                query: req.query,
                session: req.session
            });
        } catch (err) {
            console.log(err.message);
            res.redirect('/?msg=server-error');
        }
    });
    app.post('/auth/signup', (req, res) => {
        try {

            var args = {
                'create_params': {
                    'email': req.body.email,
                    'password': req.body.password,
                    'salt': process.env.AUTH_SALT,
                    'perms': {
                        'user': true,
                    },
                    'created_at': `${new Date}`,
                    'created_by': 'Self Signup',
                }
            };

            ugle_auth.createUser(dtb, args, (err) => {
                if (err) {
                    console.log(err.message);
                    res.redirect('/auth/login?msg=signup-failed');
                } else {
                    res.redirect('/auth/login');
                }
            });

        } catch (err) {
            console.log(err.message);
            res.redirect('/?msg=server-error');
        }
    });




    // login
    app.get('/auth/login', (req, res) => {
        try {
            res.render('auth/login', {
                query: req.query,
                session: req.session
            });
        } catch (err) {
            console.log(err.message);
            res.redirect('/?msg=server-error');
        }
    });
    app.post('/auth/login', (req, res) => {
        try {

            var args = {
                'login_params': {
                    'email': req.body.email,
                    'password': req.body.password,
                    'salt': process.env.AUTH_SALT,
                },
                'session': req.session
            };

            ugle_auth.loginUser(dtb, args, (err, session) => {
                if (err) {
                    console.log(err.message);
                    res.redirect('/auth/login?msg=login-failed');
                } else {
                    req.session = session;
                    res.redirect('/account/home');
                }
            });

        } catch (err) {
            console.log(err.message);
            res.redirect('/?msg=server-error');
        }
    });


    // logout
    app.get('/auth/logout', (req, res) => {
        try {
            res.render('auth/logout', {
                query: req.query,
                session: req.session
            });
        } catch (err) {
            console.log(err.message);
            res.redirect('/?msg=server-error');
        }
    });
    app.post('/auth/logout', (req, res) => {
        try {
            var args = {
                'session': req.session
            };

            ugle_auth.logoutUser(args, (err, session) => {
                if (err) {
                    console.log(err.message);
                    res.redirect('/auth/login?msg=logout-failed');
                } else {
                    req.session = session;
                    res.redirect('/auth/login?msg=logout-successful');
                }
            });

        } catch (err) {
            console.log(err.message);
            res.redirect('/?msg=server-error');
        }
    });




    // forgot password
    app.get('/auth/forgot-password', (req, res) => {
        try {
            res.render('auth/forgot-password', {
                query: req.query,
                session: req.session
            });
        } catch (err) {
            console.log(err.message);
            res.redirect('/?msg=server-error');
        }
    });
    app.post('/auth/forgot-password', (req, res) => {
        try {

            var args = {
                'recipient': req.body.email,
                'sender': process.env.EMAIL_SENDER,
                'domain': process.env.EMAIL_DOMAIN,
                'token': process.env.EMAIL_TOKEN,
                'text': 'Requested Password Reset Link',
                'html': `<h4>Reset Password Link</h4><p>Please click the link below to change your password.</p><a href="${process.env.WEBAPP_DOMAIN}/auth/change-password?email=${req.body.email}&tempkey=">Change my Password</a>`
            };

            ugle_auth.sendTempkeyEmail(dtb, args, (err) => {
                if (err) {
                    console.log(err.message);
                    res.redirect('/auth/login?msg=email-failed');
                } else {
                    res.redirect('/auth/login?msg=email-sent');
                }
            });

        } catch (err) {
            console.log(err.message);
            res.redirect('/?msg=server-error');
        }

    });

    // change password
    app.get('/auth/change-password', (req, res) => {
        try {
            res.render('auth/change-password', {
                query: req.query,
                session: req.session
            });
        } catch (err) {
            console.log(err.message);
            res.redirect('/?msg=server-error');
        }
    });
    app.post('/auth/change-password', (req, res) => {
        try {

            var args = {
                'email': req.query.email,
                'tempkey': req.query.tempkey,
                'password': req.body.password,
                'salt': process.env.AUTH_SALT
            };

            ugle_auth.changePassword(dtb, args, (err) => {
                if (err) {
                    console.log(err.message);
                    res.redirect('/auth/login?msg=change-password-failed');
                } else {
                    res.redirect('/auth/login?msg=change-password-successful');
                }
            });

        } catch (err) {
            console.log(err.message);
            res.redirect('/?msg=server-error');
        }
    });




    // verify account
    app.get('/auth/verify', (req, res) => {
        res.redirect('/auth/verify-request');
    });
    app.get('/auth/verify-request', (req, res) => {
        try {
            res.render('auth/verify-request', {
                query: req.query,
                session: req.session
            });
        } catch (err) {
            console.log(err.message);
            res.redirect('/?msg=server-error');
        }
    });
    app.post('/auth/verify-request', (req, res) => {
        try {

            var args = {
                'recipient': req.session.email,
                'sender': process.env.EMAIL_SENDER,
                'domain': process.env.EMAIL_DOMAIN,
                'token': process.env.EMAIL_TOKEN,
                'text': 'Requested Account Verification Link',
                'html': `<h4>Account Verification Link</h4><p>Please click the link below to verify your account.</p><a href="${process.env.WEBAPP_DOMAIN}/auth/verify-confirm?email=${req.session.email}&tempkey=">Verify my Account</a>`
            };

            ugle_auth.sendTempkeyEmail(dtb, args, (err) => {
                if (err) {
                    console.log(err.message);
                    res.redirect('/auth/login?msg=email-failed');
                } else {
                    res.redirect('/auth/login?msg=email-sent');
                }
            });

        } catch (err) {
            console.log(err.message);
            res.redirect('/?msg=server-error');
        }

    });

    app.get('/auth/verify-confirm', (req, res) => {
        try {

            var args = {
                'email': req.query.email,
                'tempkey': req.query.tempkey,
            };

            ugle_auth.verifyUser(dtb, args, (err) => {
                if (err) {
                    console.log(err.message);
                    res.redirect('/auth/login?msg=verification-failed');
                } else {
                    res.redirect('/auth/login?msg=verification-successful');
                }
            });

        } catch (err) {
            console.log(err.message);
            res.redirect('/?msg=server-error');
        }

    });


};
