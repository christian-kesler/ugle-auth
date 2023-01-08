// routes, useDefaultViews
/* 
    auth, redirects to 
    signup, 
    login,
    logout, 
    forgotPassword
    resetPassword
    refreshSession, for signed in users
    changePassword, for signed in users
    verifyAccount, for signed in users
    deleteAccount, for signed in users
    lockAccount, for admins only
    unlockAccount, for admins only
*/

const auth = require(`${__dirname}/auth.js`);
const log = require(`${__dirname}/log.js`)


module.exports = function (app, dtb) {


    // directory redirect
    app.get('/auth', (req, res) => {
        try {
            if (auth.isLoggedIn(req.session, res)) {
                res.redirect(login_redirect);
            }
        } catch (err) {
            console.error(err.message);
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
            console.error(err.message);
            res.redirect('/?msg=server-error');
        }
    });
    app.post('/auth/signup', (req, res) => {
        action = 'signup'

        try {

            var args = {
                'email': req.body.email,
                'password': req.body.password,
                'created_by': 0,
            };

            auth.createUser(dtb, args, (err) => {
                if (err) {
                    console.error(err.message);
                    res.redirect('/auth/login?msg=signup-failed');
                } else {
                    log(dtb, {
                        'action': action,
                        'recipient': 0,
                        'data': '',
                        'performed_by': (req.session.id || 0),
                    })

                    res.redirect('/auth/login');
                }
            });

        } catch (err) {
            console.error(err.message);
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
            console.error(err.message);
            res.redirect('/?msg=server-error');
        }
    });
    app.post('/auth/login', (req, res) => {
        action = 'login'

        try {

            var args = {
                'email': req.body.email,
                'password': req.body.password,
            };

            auth.login(dtb, args, (err, session) => {
                if (err) {
                    console.error(err.message);
                    res.redirect('/auth/login?msg=login-failed');
                } else {
                    req.session = session;

                    log(dtb, {
                        'action': action,
                        'recipient': req.session.id,
                        'data': '',
                        'performed_by': req.session.id,
                    })

                    res.redirect('/account/home');
                }
            });

        } catch (err) {
            console.error(err.message);
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
            console.error(err.message);
            res.redirect('/?msg=server-error');
        }
    });
    app.post('/auth/logout', (req, res) => {
        action = 'logout'

        try {

            auth.logout(req.session, (err, session) => {
                if (err) {
                    console.error(err.message);
                    res.redirect('/auth/login?msg=logout-failed');
                } else {
                    log(dtb, {
                        'action': action,
                        'recipient': req.session.id,
                        'data': '',
                        'performed_by': req.session.id,
                    })

                    req.session = session;
                    res.redirect('/auth/login?msg=logout-successful');
                }
            });

        } catch (err) {
            console.error(err.message);
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
            console.error(err.message);
            res.redirect('/?msg=server-error');
        }
    });
    app.post('/auth/forgot-password', (req, res) => {
        action = 'forgot-password'

        try {

            var args = {
                'recipient': req.body.email,
                'subject': 'Requested Password Reset Link',
                'text': `=== Reset Password Link === Please copy and paste this link into your browser to reset your password: ${process.env.WEBAPP_DOMAIN}/auth/reset-password?email=${req.body.email}&tempkey=`,
                'html': `<h4>Reset Password Link</h4><p>Please click the link below to reset your password.</p><a href="${process.env.WEBAPP_DOMAIN}/auth/reset-password?email=${req.body.email}&tempkey=">Change my Password</a>`
            };

            auth.sendTempkeyEmail(dtb, args, (err) => {
                if (err) {
                    console.error(err.message);
                    res.redirect('/auth/login?msg=email-failed');
                } else {

                    auth.readUser(dtb, req.body.email, (err, user) => {
                        if (err) {
                            console.error(err.message)
                        } else {
                            log(dtb, {
                                'action': action,
                                'recipient': user.id,
                                'data': '',
                                'performed_by': (req.session.id || 0),
                            })
                        }
                    })

                    res.redirect('/auth/login?msg=email-sent');
                }
            });

        } catch (err) {
            console.error(err.message);
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
            console.error(err.message);
            res.redirect('/?msg=server-error');
        }
    });
    app.post('/auth/reset-password', (req, res) => {
        action = 'reset-password'

        try {

            var args = {
                'email': req.query.email,
                'tempkey': req.query.tempkey,
                'password': req.body.password
            };

            auth.resetPassword(dtb, args, (err) => {
                if (err) {
                    console.error(err.message);
                    res.redirect('/auth/login?msg=reset-password-failed');
                } else {

                    auth.readUser(dtb, req.query.email, (err, user) => {
                        if (err) {
                            console.error(err.message)
                        } else {
                            log(dtb, {
                                'action': action,
                                'recipient': user.id,
                                'data': '',
                                'performed_by': (req.session.id || 0),
                            })
                        }
                    })

                    res.redirect('/auth/login?msg=reset-password-successful');
                }
            });

        } catch (err) {
            console.error(err.message);
            res.redirect('/?msg=server-error');
        }
    });




    // refresh session, logged in users only
    app.get('/auth/refresh-session', (req, res) => {
        action = 'refresh-session'

        try {
            if (auth.isLoggedIn(req.session, res)) {

                auth.refreshSession(dtb, req.session, (err, session) => {
                    if (err) {
                        console.error(err.message);
                        res.redirect(`${login_redirect}?msg=${action}-failed`);
                    } else {
                        req.session = session
                        res.redirect(`${login_redirect}?msg=${action}-successful`);
                    }
                })

            }
        } catch (err) {
            console.error(err.message);
            res.redirect('/?msg=server-error');
        }
    });




    // change password, logged in users only
    app.get('/auth/change-password', (req, res) => {
        try {
            if (auth.isLoggedIn(req.session, res)) {

                res.render('auth/change-password', {
                    query: req.query,
                    session: req.session
                });

            }
        } catch (err) {
            console.error(err.message);
            res.redirect('/?msg=server-error');
        }
    });
    app.post('/auth/change-password', (req, res) => {
        action = 'refresh-session'

        try {
            if (auth.isLoggedIn(req.session, res)) {

                var args = {
                    'email': req.session.email,
                    'password': req.body.password
                };

                auth.changePassword(dtb, args, (err) => {
                    if (err) {
                        console.error(err.message);
                        res.redirect(`${login_redirect}?msg=${action}-failed`);
                    } else {

                        log(dtb, {
                            'action': action,
                            'recipient': req.session.id,
                            'data': '',
                            'performed_by': req.session.id,
                        })

                        res.redirect(`${login_redirect}?msg=${action}-successful`);
                    }
                });

            }
        } catch (err) {
            console.error(err.message);
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
            console.error(err.message);
            res.redirect('/?msg=server-error');
        }
    });
    app.post('/auth/request-verification', (req, res) => {
        action = 'request-verification'

        try {

            var args = {
                'recipient': req.session.email,
                'subject': 'Requested Account Verification Link',
                'text': `=== Account Verification Link === Please copy and paste this link into your browser to verify your account: ${process.env.WEBAPP_DOMAIN}/auth/confirm-verification?tempkey=`,
                'html': `<h4>Account Verification Link</h4><p>Please click the link below to verify your account.</p><a href="${process.env.WEBAPP_DOMAIN}/auth/confirm-verification?tempkey=">Verify My Account</a>`
            };

            auth.sendTempkeyEmail(dtb, args, (err) => {
                if (err) {
                    console.error(err.message);
                    res.redirect('/auth/login?msg=email-failed');
                } else {

                    log(dtb, {
                        'action': action,
                        'recipient': req.session.id,
                        'data': '',
                        'performed_by': req.session.id,
                    })

                    res.redirect('/auth/login?msg=email-sent');
                }
            });

        } catch (err) {
            console.error(err.message);
            res.redirect('/?msg=server-error');
        }

    });
    app.get('/auth/confirm-verification', (req, res) => {
        action = 'confirm-verification'

        try {

            if (auth.isLoggedIn(req.session, res)) {
                var args = {
                    'email': req.session.email,
                    'tempkey': req.query.tempkey,
                };

                auth.verifyUser(dtb, args, (err) => {
                    if (err) {
                        console.error(err.message);
                        res.redirect('/auth/login?msg=verification-failed');
                    } else {
                        res.redirect('/auth/login?msg=verification-successful');
                    }
                });
            }

        } catch (err) {
            console.error(err.message);
            res.redirect('/?msg=server-error');
        }

    });




    // delete account, logged in users only
    app.get('/auth/delete-account', (req, res) => {
        try {
            if (auth.isLoggedIn(req.session, res)) {

                res.render('auth/delete-account', {
                    query: req.query,
                    session: req.session
                });

            }
        } catch (err) {
            console.error(err.message);
            res.redirect('/?msg=server-error');
        }
    });
    app.post('/auth/delete-account', (req, res) => {
        action = 'delete-account'

        try {
            if (auth.isLoggedIn(req.session, res)) {

                var args = {
                    'email': req.session.email,
                    'password': req.body.password
                };

                auth.changePassword(dtb, args, (err) => {
                    if (err) {
                        console.error(err.message);
                        res.redirect(`${login_redirect}?msg=${action}-failed`);
                    } else {

                        auth.logout(req.session, (err, session) => {
                            if (err) {
                                console.error(err.message);
                                res.redirect(`${login_redirect}?msg=${action}-failed`);
                            } else {

                                log(dtb, {
                                    'action': action,
                                    'recipient': req.session.id,
                                    'data': '',
                                    'performed_by': req.session.id,
                                })

                                req.session = session
                                res.redirect(`${login_redirect}?msg=${action}-successful`);

                            }
                        })

                    }
                });

            }
        } catch (err) {
            console.error(err.message);
            res.redirect('/?msg=server-error');
        }
    });




    // lock account, admins only
    app.get('/auth/lock-account', (req, res) => {
        try {
            if (auth.hasPermission(req.session, res, 'admin')) {

                res.render('auth/lock-account', {
                    query: req.query,
                    session: req.session
                });

            }
        } catch (err) {
            console.error(err.message);
            res.redirect('/?msg=server-error');
        }
    });
    app.post('/auth/lock-account', (req, res) => {
        action = 'lock-account'

        try {
            if (auth.hasPermission(req.session, res, 'admin')) {

                auth.lockAccount(dtb, req.body.email, (err) => {
                    if (err) {
                        console.error(err.message);
                        res.redirect(`${login_redirect}?msg=${action}-failed`);
                    } else {

                        auth.readUser(dtb, req.body.email, (err, user) => {
                            if (err) {
                                console.error(err.message)
                            } else {
                                log(dtb, {
                                    'action': action,
                                    'recipient': user.id,
                                    'data': '',
                                    'performed_by': req.session.id,
                                })
                            }
                        })

                        res.redirect(`${login_redirect}?msg=${action}-successful`);

                    }
                });

            }
        } catch (err) {
            console.error(err.message);
            res.redirect('/?msg=server-error');
        }
    });


    // unlock account, admins only
    app.get('/auth/unlock-account', (req, res) => {
        try {
            if (auth.hasPermission(req.session, res, 'admin')) {

                res.render('auth/unlock-account', {
                    query: req.query,
                    session: req.session
                });

            }
        } catch (err) {
            console.error(err.message);
            res.redirect('/?msg=server-error');
        }
    });
    app.post('/auth/unlock-account', (req, res) => {
        action = 'unlock-account'

        try {
            if (auth.hasPermission(req.session, res, 'admin')) {

                auth.unlockAccount(dtb, req.body.email, (err) => {
                    if (err) {
                        console.error(err.message);
                        res.redirect(`${login_redirect}?msg=${action}-failed`);
                    } else {


                        auth.readUser(dtb, req.body.email, (err, user) => {
                            if (err) {
                                console.error(err.message)
                            } else {
                                log(dtb, {
                                    'action': action,
                                    'recipient': user.id,
                                    'data': '',
                                    'performed_by': req.session.id,
                                })
                            }
                        })

                        res.redirect(`${login_redirect}?msg=${action}-successful`);

                    }
                });

            }
        } catch (err) {
            console.error(err.message);
            res.redirect('/?msg=server-error');
        }
    });




    // add permission, admins only
    app.get('/auth/add-permission', (req, res) => {
        try {
            if (auth.hasPermission(req.session, res, 'admin')) {

                res.render('auth/add-permission', {
                    query: req.query,
                    session: req.session
                });

            }
        } catch (err) {
            console.error(err.message);
            res.redirect('/?msg=server-error');
        }
    });
    app.post('/auth/add-permission', (req, res) => {
        action = 'add-permission'

        try {
            if (auth.hasPermission(req.session, res, 'admin')) {

                args = {
                    'email': req.query.email,
                    'permission': req.query.permission
                }

                auth.addPermission(dtb, args, (err) => {
                    if (err) {
                        console.error(err.message);
                        res.redirect(`${login_redirect}?msg=${action}-failed`);
                    } else {

                        auth.readUser(dtb, req.query.email, (err, user) => {
                            if (err) {
                                console.error(err.message)
                            } else {
                                log(dtb, {
                                    'action': action,
                                    'recipient': user.id,
                                    'data': req.query.permission,
                                    'performed_by': req.session.id,
                                })
                            }
                        })

                        res.redirect(`${login_redirect}?msg=${action}-successful`);

                    }
                });

            }
        } catch (err) {
            console.error(err.message);
            res.redirect('/?msg=server-error');
        }
    });


    // remove permission, admins only
    app.get('/auth/remove-permission', (req, res) => {
        try {
            if (auth.hasPermission(req.session, res, 'admin')) {

                res.render('auth/remove-permission', {
                    query: req.query,
                    session: req.session
                });

            }
        } catch (err) {
            console.error(err.message);
            res.redirect('/?msg=server-error');
        }
    });
    app.post('/auth/remove-permission', (req, res) => {
        action = 'remove-permission'

        try {
            if (auth.hasPermission(req.session, res, 'admin')) {

                args = {
                    'email': req.query.email,
                    'permission': req.query.permission
                }

                auth.removePermission(dtb, args, (err) => {
                    if (err) {
                        console.error(err.message);
                        res.redirect(`${login_redirect}?msg=${action}-failed`);
                    } else {

                        auth.readUser(dtb, req.query.email, (err, user) => {
                            if (err) {
                                console.error(err.message)
                            } else {
                                log(dtb, {
                                    'action': action,
                                    'recipient': user.id,
                                    'data': req.query.permission,
                                    'performed_by': req.session.id,
                                })
                            }
                        })

                        res.redirect(`${login_redirect}?msg=${action}-successful`);

                    }
                });

            }
        } catch (err) {
            console.error(err.message);
            res.redirect('/?msg=server-error');
        }
    });


};
