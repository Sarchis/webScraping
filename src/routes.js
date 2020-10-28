const zaraRoutes = require('./api/zara/zara.routes')


module.exports = (app) => {
    app.use('/api', zaraRoutes)
}