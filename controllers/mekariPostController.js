const apiClient = require('../services/apiMekari.js')
const HmacAuthService = require('../services/hmacAuthService.js')
const FormData = require('form-data')

// Upload Document : Note cannot use generateHeaders function, 
// because wrong data type (not JSON, but multipart form.)
exports.postUploadDoc = async (req, res) => { 
    try{ 
        if(!req.file) {
            return res.status(400).json({ error:'No file uploaded' })
        }

        const { comply_psre, callback } = req.body

        //Building formdata
        const form = new FormData() 
        form.append('doc', req.file.buffer, { 
            filename: req.file.originalname,
            contentType: req.file.mimetype,
            knownLength: req.file.size
        })
        form.append('comply_psre', comply_psre || 'false') //Default false
        form.append('callback', `https://8588cd144a04.ngrok-free.app/documents/callback`)

        //HMAC header config (pass endpoint +method) 
        const apiConfig = { 
            apiEndpoint: '/v2/esign/v1/documents/upload', 
            apiMethod : 'POST'
        }
        const hmacHeaders = HmacAuthService.generateHeaders(apiConfig)

        //Merge HMAC Headers with form-data headers
        const headers = { 
            ...hmacHeaders,
            ...form.getHeaders() //set correct multipart boundary
        }

        console.log('Headers : ', headers)

        //send to API 
        const response = await apiClient.post(
            apiConfig.apiEndpoint, form, { headers }
        )

        res.status(response.status).json(response.data)
        console.log('Response :  ',response.data)
    
    } catch (error) { 
        console.error('eMeterai Stamp  Error : ', error.response?.data || error.message)
        res.status(error.response?.status || 500).json({ 
            error: error.response?.data || 'Failed to apply eMeterai stamp',
            message: error.message 
        })
    }
}

//================================================


