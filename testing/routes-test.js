const dotenv = require('dotenv');
dotenv.config();




const express = require('express');
const session = require('express-session');




const ugle_auth = require(`${__dirname}/../index.js`);
ugle_auth.initDtb(`${__dirname}/test.db`, (err, dtb) => {
    if (err) {
        console.error(err.message);
    } else {
        dtb.exec('DROP TABLE IF EXISTS auth;');


        // initialization
        const app = express();


        // configuration
        app.use(
            session({
                cookie: {
                    // httpOnly: true,
                    // secure: true,
                    sameSite: true,
                    maxAge: 500 * 60 * 1000,
                    // expires: 5 * 60 * 1000,
                },
                resave: true,
                saveUninitialized: true,
                secret: 'secret',
                secure: true,
            })
        );


        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));


        const path = require('path');
        app.set('view engine', 'ejs');
        app.set('views', path.join(__dirname, '/../views'));




        ugle_auth.routes(app, dtb);

        // custom routing
        app.get('/', (req, res) => {
            res.render('test-views/homepage', {
                query: req.query,
                session: req.session
            });
        });

        app.get('/account/home', (req, res) => {
            res.render('test-views/account-home', {
                query: req.query,
                session: req.session
            });
        });

        app.get('/debug/session', (req, res) => {
            res.send(req.session);
            res.end();
        });

        app.get('/debug/auth', (req, res) => {
            ugle_auth.allUsers(dtb, (err, data) => {
                if (err) {
                    console.error(err);
                } else {
                    res.send(data);
                    res.end();
                }
            });
        });

        // listening on development port
        app.listen(3000);
        console.log('listening on port 3000');


    }
});
