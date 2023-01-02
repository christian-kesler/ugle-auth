const routes = require(`${__dirname}/utils/routes`);
const handlers = require(`${__dirname}/utils/handlers`);




module.exports = {
    routes,
    ...handlers
};