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

// Upload Document : Note cannot use generateHeaders function, 
// because wrong data type (not JSON, but multipart form.)
// exports.postUploadDoc = async (req,res) => { 
//     const apiConfig = {
//             apiEndpoint: '/v2/esign/v1/documents/upload',
//             apiMethod: 'POST'
//         }
//     const headers = HmacAuthService.generateHeaders(apiConfig)
//     try{ 
//         if(!req.file) { 
//         return res.status(400).json({error : 'No file uploaded'})
//         }

//         const { comply_psre }= req.body

//         const form = new FormData() 
//         form.append('doc', req.file.buffer, { 
//             filename: req.file.originalname,
//             contentType: req.file.mimetype,
//             knownLength: req.file.size
//         })
//         form.append('comply_psre', comply_psre === 'true' ? 'true' : 'false') //default : false
//         form.append('callback', `https://b8fa0c0a2d46.ngrok-free.app/v2/esign/v1/documents/callback`)

//         const response = await apiClient.post( 
//             apiConfig.apiEndpoint,
//             // req.body,
//             form,
//             { headers: headers },
//         )

//         res.status(200).json(response.data)
//     } catch (error) {
//         console.error('eMeterai Stamp  Error : ', error.response?.data || error.message)
//         res.status(error.response?.status || 500).json({ 
//             error: error.response?.data || 'Failed to apply eMeterai stamp',
//             message: error.message 
//         })
//     }
// }


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
        form.append('callback', `https://01e5aa68b387.ngrok-free.app/documents/callback`)

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

        //send to API 
        const response = await apiClient.post(
            apiConfig.apiEndpoint, form, { headers }
        )

        res.status(response.status).json(response.data)
    
    } catch (error) { 
        console.error('eMeterai Stamp  Error : ', error.response?.data || error.message)
        res.status(error.response?.status || 500).json({ 
            error: error.response?.data || 'Failed to apply eMeterai stamp',
            message: error.message 
        })
    }
}
