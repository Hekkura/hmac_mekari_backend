const apiClient = require('../services/apiMekari.js')
const HmacAuthService = require('../services/hmacAuthService.js')
const { getRedisClient } = require('../services/redisHelper.js')

//Get Document Lists
exports.getDocumentLists = async(req, res) => { 
    //Redis implementation
    // Inside redis cache? If yey, return redis cache
    // If not query APi query APi
    const redis = getRedisClient(req.app)

    const page = req.query.page || 1
    const limit = req.query.limit || 8
    const category = req.query.category || 'psre'
    const signing_status = req.query.signing_status || 'in_progress'

    const queryParams = new URLSearchParams({
        page,
        limit,
        category,
        signing_status
    }).toString()

    const cacheKey = `documents:${queryParams}`

    //Check Redis Cache
    if(redis){
        try { 
            const cachedData = await redis.get(cacheKey)
            if(cachedData) {
                console.log('📦 Cache hit')
                return res.json(JSON.parse(cachedData))
            }
        } catch (errCache) {
            console.warn('⚠️ Cache Miss', err.message)
        }
    }

    // Fetch from external API
    const apiConfig = { 
        apiEndpoint : `/v2/esign/v1/documents?${queryParams}`,
        apiMethod : 'GET',
    }
    const headers = HmacAuthService.generateHeaders(apiConfig)
    
    try { 
        const response = await apiClient.get(
            apiConfig.apiEndpoint, { 
                headers : headers
            }
        )
        //Cache response in redis (write to redis)
        if (redis) {  
            try { 
                // await redis.setEx(cacheKey, 300, JSON.stringify(response.data)) // TTL = 300s
                await redis.set(cacheKey, JSON.stringify(response.data), { 
                    EX: 600
                })
                console.log('💾 Write response to Redis cache')
            } catch (err) {
                console.warn('⚠️ Redis write failed', err.message)
            }
        }

        res.json(response.data)
    } catch (error) { 
        console.error('Get Documents Error : ', error.response?.data || error.message)
        res.status(error.response?.status || 500).json({ 
            error: error.response?.data || 'Internal server error',
            message: error.message 
        })
    }
}

//Get Document Detail
exports.getDocumentDetail = async(req, res) => { 
    const documentId = req.params.documentId
    const apiConfig = {
        apiEndpoint : `/v2/esign/v1/documents/${documentId}`,
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
        console.error('Get Documents Error : ', error.response?.data || error.message)
        res.status(error.response?.status || 500).json({ 
            error: error.response?.data || 'Internal server error',
            message: error.message 
        })
    }
}

//Download Document File
exports.getDownload = async(req, res) => { 
    const documentId = req.params.documentId
    const apiConfig = {
        apiEndpoint : `/v2/esign/v1/documents/${documentId}/download`,
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
        console.error('Get Documents Error : ', error.response?.data || error.message)
        res.status(error.response?.status || 500).json({ 
            error: error.response?.data || 'Internal server error',
            message: error.message 
        })
    }
}