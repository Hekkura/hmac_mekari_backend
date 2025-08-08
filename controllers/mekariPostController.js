const apiClient = require('../services/apiMekari.js')
const HmacAuthService = require('../services/hmacAuthService.js')
const FormData = require('form-data')

//Global - Request Sign
exports.postRequestSign = async (req, res) => { 
    const apiConfig = {
        apiEndpoint: '/v2/esign/v1/documents/request_global_sign',
        apiMethod: 'POST',
        body: req.body
    }
    const headers = HmacAuthService.generateHeaders(apiConfig)

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

// Stamp eMeterai to the Document
exports.postStamp = async (req, res) => { 
    const apiConfig = {
            apiEndpoint: '/v2/esign/v1/documents/stamp',
            apiMethod: 'POST',
            body: req.body
        }
    const headers = HmacAuthService.generateHeaders(apiConfig)
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

// Upload Document
exports.postUploadDoc = async (req,res) => { 
    const apiConfig = {
            apiEndpoint: '/v2/esign/v1/documents/stamp',
            apiMethod: 'POST',
            body: req.body
        }
    const headers = HmacAuthService.generateHeaders(apiConfig)
    try{ 
        if(!req.file) { 
        return res.status(400).json({error : 'No file uploaded'})
        }

        const form = new FormData() 
        form.append('doc', req.file.buffer, { 
            filename: req.file.originalname,
            contentType: req.file.mimetype,
            knownLength: req.file.size
        })
        form.append('comply_psre', req.body.comply_psre ? 'true' : 'false' )


        const response = await apiClient.post( 
            apiConfig.apiEndpoint,
            // req.body,
            form,
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