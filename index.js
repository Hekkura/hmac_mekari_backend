const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv')


dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

//redis setup
const redis = require('redis')
const client = redis.createClient({
    // url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
})
   
//Redis connection handling
const connectRedis = async () => {
    try {
        await client.connect()
        console.log('✅ Redis connected successfully')
    } catch (error) {
        console.error('❌ Redis connection failed:', error.message)
        console.log('⚠️  App will continue without Redis caching')
    }
}
//Connect to redis
connectRedis() 

//redis event handlers
client.on('error', (err) => { 
    console.error("Redis error : ", err)
})
client.on('reconnecting', () => { 
    console.log('🔄 Redis reconnecting...')
})

// Make Redis client available to routes
app.locals.redis = client

//Middleware
app.use(cors())
app.use(express.json({limit: '50mb'}))
app.use(morgan('dev'))

//Routes
const apiRoutes = require('./routes/api.js')
app.use('/', apiRoutes)


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Health Check endpoint
app.get('/health_chk', async(req,res) => { 
    try{ 
        const redisStatus = client.isReady ? 'connected' : 'disconnected'
        res.json( { 
            status: 'ok',
            redis: redisStatus,
            timestamp : new Date().toISOString()
        })
    } catch(error) { 
        res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
})

//Graceful Shutdown code
const gracefulShutdown = async () => { 
    console.log("Shutting Down Gracefully...")
    try {
        if(client.isReady){ 
            await client.quit()
            console.log("Redis Connection Closed")
        }
        process.exit(0)
    } catch (error)  { 
        console.error("Error during shutdown : ", error)
        process.exit(1)
    }
}

process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)

//Start server listener
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`)
})