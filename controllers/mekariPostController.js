const apiClient = require('../services/apiMekari.js')
const HmacAuthService = require('../services/hmacAuthService.js')

//Global - Request Sign
exports.postRequestSign = async (req, res) => { 
    const apiConfig = {
        apiEndpoint: '/v2/esign/v1/documents/request_global_sign',
        apiMethod: 'POST',
        body: req.body
    }
    const headers = generateHeaders(apiConfig)

    try { 
        const response = await apiClient.post(
            apiConfig.apiEndpoint, 
            req.body,
            { headers: headers },
        )
        const { id } = response.data.data
        res.status(200).json({ ...response.data, document_id: id })
    } catch (error) { 
        console.error('Post Error : ', error.response?.data || error.message)
        res.status(error.response?.status || 500).json({ 
            error: error.response?.data || 'Internal server error',
            message: error.message 
        })
    }
}

exports.postStamp = async (req, res) => { 
    const apiConfig = {
            apiEndpoint: '/v2/esign/v1/documents/stamp',
            apiMethod: 'POST',
            body: req.body
        }
    const headers = generateHeaders(apiConfig)
    try { 
        const response = await apiClient.post(
            apiConfig.apiEndpoint, 
            req.body,
            { headers: headers },
        )
        const { id } = response.data.data
        res.status(200).json(response.data)
    } catch (error) { 
        console.error('eMeterai Stamp  Error : ', error.response?.data || error.message)
        res.status(error.response?.status || 500).json({ 
            error: error.response?.data || 'Failed to apply eMeterai stamp',
            message: error.message 
        })
    }
}