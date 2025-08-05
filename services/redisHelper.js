//Fallback guard if redis fails
function getRedisClient(app) {
    //app locals redis = client redis
    return app.locals.redis?.isReady ? app.locals.redis : null
}

module.exports = { getRedisClient }