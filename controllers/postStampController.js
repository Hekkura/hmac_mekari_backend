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
    console.log(req.body)

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

// Stamp eMeterai to the Document (with file)
exports.postStampTEST = async (req, res) => { 
    console.log('hit API start')
try { 
        if(!req.file) { 
             return res.status(400).json({ error:'No file uploaded' }) 
        }
        const { filename, signers, meterai } = req.body

        const form = new FormData() 
        const fileBase64 = req.file.buffer.toString('base64')

        form.append('doc', fileBase64)
        form.append('filename', filename || req.file.originalname)
        // form.append('signers', signers)
        form.append('meterai', meterai)

        // console.log(signers)
        console.log(meterai)
        const apiConfig = {
            apiEndpoint: '/v2/esign/v1/documents/stamp',
            apiMethod: 'POST',
        }
        const hmacHeaders = HmacAuthService.generateHeaders(apiConfig)
        const { 'Content-Type': _, ...hmacHeadersWithoutContentType } = hmacHeaders;
        const headers = { 
            ...hmacHeadersWithoutContentType,
            ...form.getHeaders() //set correct multipart boundary
        }
        console.log('Headers : ', headers)
        const response = await apiClient.post ( 
            apiConfig.apiEndpoint, 
            form, 
            { headers }
        )
        res.status(response.status).json(response.data)
        console.log("response : ", response.data)



} catch (error) { 
        console.error('eMeterai Stamp Error : ', error.response?.data || error.message)
        res.status(error.response?.status || 500).json({ 
            error: error.response?.data || 'Failed to apply eMeterai stamp',
            message: error.message 
        })
    }
}


// Stamp eMeterai to the Document via Form Data

exports.postStampFormData= async (req, res) => { 
try { 
        if(!req.file) { 
             return res.status(400).json({ error:'No file uploaded' }) 
        }
        const { filename, annotations, meterai } = req.body

        const form = new FormData() 
        const fileBase64 = req.file.buffer.toString('base64')

        form.append('doc', fileBase64)
        form.append('filename', filename || req.file.originalname)
        // form.append('signers', signers)
        form.append('annotations', annotations)
        form.append('meterai', JSON.parse(meterai))

        const apiConfig = {
            apiEndpoint: '/v2/esign/v1/documents/stamp',
            apiMethod: 'POST',
        }
        const hmacHeaders = HmacAuthService.generateHeaders(apiConfig)
        const { 'Content-Type': _, ...hmacHeadersWithoutContentType } = hmacHeaders;
        const headers = { 
            ...hmacHeadersWithoutContentType,
            ...form.getHeaders() //set correct multipart boundary
        }
        console.log('Headers : ', headers)
        const response = await apiClient.post ( 
            apiConfig.apiEndpoint, 
            form, 
            { headers }
        )
        res.status(response.status).json(response.data)
        console.log("response : ", response.data)

} catch (error) { 
        console.error('eMeterai Stamp Error : ', error.response?.data || error.message)
        res.status(error.response?.status || 500).json({ 
            error: error.response?.data || 'Failed to apply eMeterai stamp',
            message: error.message 
        })
    }
}
