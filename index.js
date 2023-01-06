const auth = require(`${__dirname}/utils/authentication-session-methods.js`);
const config = require(`${__dirname}/utils/configuration-methods.js`);
// const hashing = require(`${__dirname}/utils/hashing-methods.js`);
const perms = require(`${__dirname}/utils/permission-methods.js`);
const routes = require(`${__dirname}/utils/routing-methods.js`);
const emailer = require(`${__dirname}/utils/tempkey-email-methods.js`);
const users = require(`${__dirname}/utils/user-crud-methods.js`);


module.exports = {
    ...auth,
    ...config,
    ...perms,
    routes,
    ...emailer,
    ...users
};