// routes, useDefaultViews
/* 
    auth, redirects to 
    signup, 
    login,
    logout, 
    forgotPassword
    resetPassword
    changePassword, for signed in users
    verifyAccount, for signed in users
    deleteAccount, for signed in users
    lockAccount, for admins only
    unlockAccount, for admins only
*/

const auth = require(`${__dirname}/utils/authentication-session-methods.js`);
// const config = require(`${__dirname}/utils/configuration-methods.js`);
// const hashing = require(`${__dirname}/utils/hashing-methods.js`);
const perms = require(`${__dirname}/utils/permission-methods.js`);
// const routes = require(`${__dirname}/utils/routing-methods.js`);
const emailer = require(`${__dirname}/utils/tempkey-email-methods.js`);
const users = require(`${__dirname}/utils/user-crud-methods.js`);


module.exports = function (app, dtb) {


    // directory redirect
    app.get('/auth', (req, res) => {
        try {
            if (perms.isLoggedIn(req.session, res)) {
                res.redirect(login_redirect);
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
                'email': req.body.email,
                'password': req.body.password,
                'created_by': 'Self Signup',
            };

            users.createUser(dtb, args, (err) => {
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
                'email': req.body.email,
                'password': req.body.password,
            };

            auth.login(dtb, args, (err, session) => {
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

            auth.logout(req.session, (err, session) => {
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
                'subject': 'Requested Password Reset Link',
                'text': `=== Reset Password Link === Please copy and paste this link into your browser to reset your password: ${process.env.WEBAPP_DOMAIN}/auth/reset-password?email=${req.body.email}&tempkey=`,
                'html': `<h4>Reset Password Link</h4><p>Please click the link below to reset your password.</p><a href="${process.env.WEBAPP_DOMAIN}/auth/reset-password?email=${req.body.email}&tempkey=">Change my Password</a>`
            };

            emailer.sendTempkeyEmail(dtb, args, (err) => {
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


    // reset password
    app.get('/auth/reset-password', (req, res) => {
        try {
            res.render('auth/reset-password', {
                query: req.query,
                session: req.session
            });
        } catch (err) {
            console.log(err.message);
            res.redirect('/?msg=server-error');
        }
    });
    app.post('/auth/reset-password', (req, res) => {
        try {

            var args = {
                'email': req.query.email,
                'tempkey': req.query.tempkey,
                'password': req.body.password
            };

            users.resetPassword(dtb, args, (err) => {
                if (err) {
                    console.log(err.message);
                    res.redirect('/auth/login?msg=reset-password-failed');
                } else {
                    res.redirect('/auth/login?msg=reset-password-successful');
                }
            });

        } catch (err) {
            console.log(err.message);
            res.redirect('/?msg=server-error');
        }
    });





    // change password, logged in users only
    /* TODO */
    app.get('/auth/change-password', (req, res) => {
        try {
            if (perms.isLoggedIn(req.session, res)) {

                res.render('auth/change-password', {
                    query: req.query,
                    session: req.session
                });

            }
        } catch (err) {
            console.log(err.message);
            res.redirect('/?msg=server-error');
        }
    });
    app.post('/auth/change-password', (req, res) => {
        try {
            if (perms.isLoggedIn(req.session, res)) {

                var args = {
                    'email': req.session.email,
                    'password': req.body.password
                };

                users.changePassword(dtb, args, (err) => {
                    if (err) {
                        console.log(err.message);
                        res.redirect(`${login_redirect}?msg=change-password-failed`);
                    } else {
                        res.redirect(`${login_redirect}?msg=change-password-successful`);
                    }
                });

            }
        } catch (err) {
            console.log(err.message);
            res.redirect('/?msg=server-error');
        }
    });




    // verify account, logged in users only
    app.get('/auth/verify', (req, res) => {
        res.redirect('/auth/request-verification');
    });
    app.get('/auth/request-verification', (req, res) => {
        try {
            res.render('auth/request-verification', {
                query: req.query,
                session: req.session
            });
        } catch (err) {
            console.log(err.message);
            res.redirect('/?msg=server-error');
        }
    });
    app.post('/auth/request-verification', (req, res) => {
        try {

            var args = {
                'recipient': req.session.email,
                'subject': 'Requested Account Verification Link',
                'text': `=== Account Verification Link === Please copy and paste this link into your browser to verify your account: ${process.env.WEBAPP_DOMAIN}/auth/confirm-verification?tempkey=`,
                'html': `<h4>Account Verification Link</h4><p>Please click the link below to verify your account.</p><a href="${process.env.WEBAPP_DOMAIN}/auth/confirm-verification?tempkey=">Verify My Account</a>`
            };

            emailer.sendTempkeyEmail(dtb, args, (err) => {
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
    app.get('/auth/confirm-verification', (req, res) => {
        try {

            if (perms.isLoggedIn(req.session, res)) {
                var args = {
                    'email': req.session.email,
                    'tempkey': req.query.tempkey,
                };

                emailer.verifyUser(dtb, args, (err) => {
                    if (err) {
                        console.log(err.message);
                        res.redirect('/auth/login?msg=verification-failed');
                    } else {
                        res.redirect('/auth/login?msg=verification-successful');
                    }
                });
            }

        } catch (err) {
            console.log(err.message);
            res.redirect('/?msg=server-error');
        }

    });




    // delete account, logged in users only
    app.get('/auth/delete-account', (req, res) => {
        try {
            if (perms.isLoggedIn(req.session, res)) {

                res.render('auth/delete-account', {
                    query: req.query,
                    session: req.session
                });

            }
        } catch (err) {
            console.log(err.message);
            res.redirect('/?msg=server-error');
        }
    });
    app.post('/auth/delete-account', (req, res) => {
        try {
            if (perms.isLoggedIn(req.session, res)) {

                var args = {
                    'email': req.session.email,
                    'password': req.body.password
                };

                users.changePassword(dtb, args, (err) => {
                    if (err) {
                        console.log(err.message);
                        res.redirect(`${login_redirect}?msg=change-password-failed`);
                    } else {

                        auth.logout(req.session, (err, session) => {
                            if (err) {
                                console.log(err.message);
                                res.redirect(`${login_redirect}?msg=logout-failed`);
                            } else {

                                req.session = session
                                res.redirect(`${login_redirect}?msg=logout-successful`);

                            }
                        })

                    }
                });

            }
        } catch (err) {
            console.log(err.message);
            res.redirect('/?msg=server-error');
        }
    });




    // lock account, admins only
    app.get('/auth/lock-account', (req, res) => {
        try {
            if (perms.hasPermission(req.session, res, 'admin')) {

                res.render('auth/lock-account', {
                    query: req.query,
                    session: req.session
                });

            }
        } catch (err) {
            console.log(err.message);
            res.redirect('/?msg=server-error');
        }
    });
    app.post('/auth/lock-account', (req, res) => {
        try {
            if (perms.hasPermission(req.session, res, 'admin')) {

                users.lockAccount(dtb, req.body.email, (err) => {
                    if (err) {
                        console.log(err.message);
                        res.redirect(`${login_redirect}?msg=change-password-failed`);
                    } else {

                        auth.logout(req.session, (err, session) => {
                            if (err) {
                                console.log(err.message);
                                res.redirect(`${login_redirect}?msg=logout-failed`);
                            } else {

                                req.session = session
                                res.redirect(`${login_redirect}?msg=logout-successful`);

                            }
                        })

                    }
                });

            }
        } catch (err) {
            console.log(err.message);
            res.redirect('/?msg=server-error');
        }
    });


    // unlock account, admins only
    app.get('/auth/unlock-account', (req, res) => {
        try {
            if (perms.hasPermission(req.session, res, 'admin')) {

                res.render('auth/unlock-account', {
                    query: req.query,
                    session: req.session
                });

            }
        } catch (err) {
            console.log(err.message);
            res.redirect('/?msg=server-error');
        }
    });
    app.post('/auth/unlock-account', (req, res) => {
        try {
            if (perms.hasPermission(req.session, res, 'admin')) {

                users.unlockAccount(dtb, req.body.email, (err) => {
                    if (err) {
                        console.log(err.message);
                        res.redirect(`${login_redirect}?msg=change-password-failed`);
                    } else {

                        auth.logout(req.session, (err, session) => {
                            if (err) {
                                console.log(err.message);
                                res.redirect(`${login_redirect}?msg=logout-failed`);
                            } else {

                                req.session = session
                                res.redirect(`${login_redirect}?msg=logout-successful`);

                            }
                        })

                    }
                });

            }
        } catch (err) {
            console.log(err.message);
            res.redirect('/?msg=server-error');
        }
    });


};
