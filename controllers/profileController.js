const apiClient = require('../services/apiMekari.js')
const HmacAuthService = require('../services/hmacAuthService.js')
const { getRedisClient } = require('../services/redisHelper.js')

//Get Profile
exports.getProfile = async(req, res) => { 
    //Redis implementation
    // const redis = getRedisClient(req.app)
    // const json = await redis.get('profile')
    // if(!redis){
    //     console.warn('⚠️ Redis unavailable — continuing without cache')
    // }

    const apiConfig = { 
        apiEndpoint : '/v2/esign/v1/profile',
        apiMethod : 'GET',
    }
    const headers = HmacAuthService.generateHeaders(apiConfig)

    try { 
        const response = await apiClient.get(
            apiConfig.apiEndpoint, { 
                headers : headers
            }
        )
        res.json(response.data)
    } catch (error) { 
        console.error('Get Profile Error : ', error.response?.data || error.message)
        res.status(error.response?.status || 500).json({ 
            error: error.response?.data || 'Internal server error',
            message: error.message 
        })
    }

}