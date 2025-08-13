const apiClient = require('../services/apiMekari.js')
const HmacAuthService = require('../services/hmacAuthService.js')
const { getRedisClient } = require('../services/redisHelper.js')

//Get Profile -> Make API request to Mekari for profile with data from cache (if present, if not error)
exports.getMekariProfile = async(req, res) => { 
    const redis = getRedisClient(req.app) 
   
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

// Get profile data -> show profile data in backend to frontend
exports.getProfileData = async (req, res) => { 
    const redis = getRedisClient(req.app)
    try {
        if(!redis) {
            throw new Error('Redis not available')
        }
        //Take data from cache
        const cachedClientID = await redis.get('clientID')
        const cachedClientSecret = await redis.get('clientSecret')

        if(!cachedClientID || !cachedClientSecret) {
            throw new Error('Profile Cache is empty or incomplete')
        } 

        console.log('Profile retreived from Redis cache')
        return res.json({
            clientID : cachedClientID,
            clientSecret : cachedClientSecret
        })
    } catch (error) { 
        // Return Error
        console.error('❌ Error in getProfileData:', error.message)
        return res.status(500).json({
            error: 'Failed to get profile data',
            message: error.message
        })
    }
}

// Delete profile data -> Delete profile cache
exports.deleteProfileData = async (req,res) => { 
    const redis = getRedisClient(req.app)
    try {
        if(!redis) {
            throw new Error('Redis not available')
        }
        await redis.del('clientID','clientSecret')

        return res.status(200).json({
            message: 'Profile cache deleted successfully'
        })
    } catch (error) { 
        // Return Error
        console.error('❌ Error in deleteProfileData:', error.message)
        return res.status(500).json({
            error: 'Failed to get profile data',
            message: error.message
        })
    }
}

// Post profile data -> Front end sends client key and secret, store in cache
exports.postProfileData = async (req,res) => { 
    const redis = getRedisClient(req.app)
    try { 
        if(!redis) {
            throw new Error('Redis not available')
        }
        const { clientID, clientSecret } = req.body
        if (!clientID || !clientSecret) {
            return res.status(400).json({ error: 'clientID and clientSecret are required' })
        }

        await redis.del('clientID','clientSecret')
        
        await redis.set('clientID', clientID, { 
            EX: 1800
        })
        await redis.set('clientSecret', clientSecret, { 
            EX:1800
        })
        return res.status(200).json({
            message: 'Profile cache updated successfully'
        })
    } catch (error) { 
        // Return Error
        console.error('❌ Error in postProfileData:', error.message)
        return res.status(500).json({
            error: 'Failed to update profile data',
            message: error.message
        })
    }
}