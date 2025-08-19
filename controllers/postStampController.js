const apiClient = require('../services/apiMekari.js')
const HmacAuthService = require('../services/hmacAuthService.js')
const FormData = require('form-data')

// Stamp eMeterai to the Document
exports.postStamp = async (req, res) => { 
    const apiConfig = {
            apiEndpoint: '/v2/esign/v1/documents/stamp',
            apiMethod: 'POST',
            body: req.body
        }


    // body.append('meterai', [])
    // body.append('date_end.value',[])
    const headers = HmacAuthService.generateHeaders(apiConfig)
    try { 
        const response = await apiClient.post(
            apiConfig.apiEndpoint, 
            req.body,
            { headers: headers },
        )
        res.status(200).json(response.data)
    } catch (error) { 
        console.error('eMeterai Stamp  Error : ', error.response?.data || error.message)
        res.status(error.response?.status || 500).json({ 
            error: error.response?.data || 'Failed to apply eMeterai stamp',
            message: error.message 
        })
    }
}
