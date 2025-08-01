const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv')
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

//Middleware
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(express.json({limit: '50mb'}))

//Routes
const apiRoutes = require('./routes/api')
app.use('/api', apiRoutes)

//Start server listener
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})