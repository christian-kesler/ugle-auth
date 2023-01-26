const auth = require(`${__dirname}/utils/auth.js`);
const routes = require(`${__dirname}/utils/routes.js`);
const log = require(`${__dirname}/utils/log.js`);


module.exports = {
    ...auth,
    routes,
    log,
};