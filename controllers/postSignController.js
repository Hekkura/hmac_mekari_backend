const { json } = require('express')
const apiClient = require('../services/apiMekari.js')
const HmacAuthService = require('../services/hmacAuthService.js')
const FormData = require('form-data')

// Global - Request Sign -> result 522 
// 'Attachments::UploadPdfServices::FailedUploadError'
exports.postRequestSign = async (req, res) => { 
    const apiConfig = {
        apiEndpoint: '/v2/esign/v1/documents/request_global_sign',
        apiMethod: 'POST',
        body: req.body
    }
    console.log("Body", req.body)
    const headers = HmacAuthService.generateHeaders(apiConfig)
    console.log("Headers", headers)

    try { 
        const response = await apiClient.post(
            apiConfig.apiEndpoint, 
            req.body,
            { headers: headers,
              timeout: 10000 //10s
            },
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

// Global - Request Sign with PDF Upload
exports.postRequestSignTEST = async (req, res) => { 
    try { 
        if(!req.file) { 
             return res.status(400).JSON({ error:'No file uploaded' }) 
        }

        const { filename, signers } = req.body
 
        const form = new FormData() 
        const fileBase64 = req.file.buffer.toString('base64')
        form.append('doc', fileBase64)
        // form.append('doc', req.file.buffer, { 
        //     filename: req.file.originalname,
        //     contentType: req.file.mimetype,
        //     knownLength: req.file.size
        // })
        form.append('filename', filename || req.file.originalname)
        form.append('signers', (JSON.parse(signers)))

        const apiConfig = { 
            apiEndpoint: '/v2/esign/v1/documents/request_global_sign', 
            apiMethod : 'POST'
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
        console.error('eMeterai Stamp  Error : ', error.response?.data || error.message)
        res.status(error.response?.status || 500).json({ 
            error: error.response?.data || 'Failed to apply eMeterai stamp',
            message: error.message 
        })
    }
}

//Global request sign - signers as form data (flat)
exports.postRequestSignTEST2 = async (req, res) => { 
    try { 
        if(!req.file) { 
             return res.status(400).json({ error:'No file uploaded' }) 
        }

        const { filename, signers, signing_order, callback_url, is_signature_without_frame } = req.body

        // Parse signers if it's a JSON string
        let parsedSigners;
        try {
            parsedSigners = typeof signers === 'string' ? JSON.parse(signers) : signers;
        } catch (parseError) {
            return res.status(400).json({ 
                error: 'Invalid signers format. Must be valid JSON array.' 
            });
        }

        if (!Array.isArray(parsedSigners)) {
            return res.status(400).json({ 
                error: 'Signers must be an array.' 
            });
        }

        const form = new FormData() 
        const fileBase64 = req.file.buffer.toString('base64')
        
        // Basic fields
        form.append('doc', fileBase64)
        form.append('filename', filename || req.file.originalname)
        
        // Handle complex nested signers structure
        parsedSigners.forEach((signer, signerIndex) => {
            // Basic signer info
            form.append(`signers[${signerIndex}][name]`, signer.name)
            form.append(`signers[${signerIndex}][email]`, signer.email)
            form.append(`signers[${signerIndex}][phone_number][country_code]`, signer.phone_number.country_code)
            form.append(`signers[${signerIndex}][phone_number][number]`, signer.phone_number.number)
            
            // Handle annotations array
            if (signer.annotations && Array.isArray(signer.annotations)) {
                signer.annotations.forEach((annotation, annotationIndex) => {
                    const prefix = `signers[${signerIndex}][annotations][${annotationIndex}]`
                    
                    // Basic annotation fields
                    form.append(`${prefix}[type_of]`, annotation.type_of)
                    form.append(`${prefix}[page]`, annotation.page.toString())
                    form.append(`${prefix}[position_x]`, annotation.position_x.toString())
                    form.append(`${prefix}[position_y]`, annotation.position_y.toString())
                    form.append(`${prefix}[element_width]`, annotation.element_width.toString())
                    form.append(`${prefix}[element_height]`, annotation.element_height.toString())
                    form.append(`${prefix}[canvas_width]`, annotation.canvas_width.toString())
                    form.append(`${prefix}[canvas_height]`, annotation.canvas_height.toString())
                    
                    // Handle auto_fields array if it exists
                    if (annotation.auto_fields && Array.isArray(annotation.auto_fields)) {
                        annotation.auto_fields.forEach((field, fieldIndex) => {
                            form.append(`${prefix}[auto_fields][${fieldIndex}]`, field)
                        })
                    }
                    
                    // Handle meterai_provided if it exists
                    if (annotation.meterai_provided !== undefined) {
                        form.append(`${prefix}[meterai_provided]`, annotation.meterai_provided.toString())
                    }
                })
            }
        })
        
        // Optional fields
        if (signing_order !== undefined) {
            form.append('signing_order', signing_order.toString())
        }
        if (callback_url) {
            form.append('callback_url', callback_url)
        }
        if (is_signature_without_frame !== undefined) {
            form.append('is_signature_without_frame', is_signature_without_frame.toString())
        }

        const apiConfig = { 
            apiEndpoint: '/v2/esign/v1/documents/request_global_sign', 
            apiMethod : 'POST'
        }
        const hmacHeaders = HmacAuthService.generateHeaders(apiConfig)
        const { 'Content-Type': _, ...hmacHeadersWithoutContentType } = hmacHeaders;
        const headers = { 
            ...hmacHeadersWithoutContentType,
            ...form.getHeaders()
        }
        
        console.log('Headers : ', headers)
        console.log('Parsed signers structure:', JSON.stringify(parsedSigners, null, 2))

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

//Request Sign global rails style
// Alternative: Rails-style array approach for complex nested data
// exports.postRequestSignTEST_RailsStyle = async (req, res) => { 
//     try { 
//         if(!req.file) { 
//              return res.status(400).json({ error:'No file uploaded' }) 
//         }

//         const { filename, signers, signing_order, callback_url, is_signature_without_frame } = req.body

//         let parsedSigners;
//         try {
//             parsedSigners = typeof signers === 'string' ? JSON.parse(signers) : signers;
//         } catch (parseError) {
//             return res.status(400).json({ 
//                 error: 'Invalid signers format. Must be valid JSON array.' 
//             });
//         }

//         const form = new FormData() 
//         const fileBase64 = req.file.buffer.toString('base64')
        
//         form.append('doc', fileBase64)
//         form.append('filename', filename || req.file.originalname)
        
//         // Try sending each signer as a complete JSON object
//         parsedSigners.forEach((signer) => {
//             form.append('signers[]', JSON.stringify(signer))
//         })
        
//         // Optional fields
//         if (signing_order !== undefined) {
//             form.append('signing_order', signing_order.toString())
//         }
//         if (callback_url) {
//             form.append('callback_url', callback_url)
//         }
//         if (is_signature_without_frame !== undefined) {
//             form.append('is_signature_without_frame', is_signature_without_frame.toString())
//         }

//         const apiConfig = { 
//             apiEndpoint: '/v2/esign/v1/documents/request_global_sign', 
//             apiMethod : 'POST'
//         }
//         const hmacHeaders = HmacAuthService.generateHeaders(apiConfig)
//         const { 'Content-Type': _, ...hmacHeadersWithoutContentType } = hmacHeaders;
//         const headers = { 
//             ...hmacHeadersWithoutContentType,
//             ...form.getHeaders()
//         }

//         const response = await apiClient.post ( 
//             apiConfig.apiEndpoint, 
//             form, 
//             { headers }
//         )
//         res.status(response.status).json(response.data)

//     } catch (error) { 
//         console.error('eMeterai Stamp Error : ', error.response?.data || error.message)
//         res.status(error.response?.status || 500).json({ 
//             error: error.response?.data || 'Failed to apply eMeterai stamp',
//             message: error.message 
//         })
//     }
// }

exports.postRequestSignTEST_RailsStyle = async (req, res) => { 
    try { 
        if(!req.file) { 
             return res.status(400).json({ error:'No file uploaded' }) 
        }

        const { filename, signers, signing_order, callback_url, is_signature_without_frame } = req.body

        const form = new FormData() 
        const fileBase64 = req.file.buffer.toString('base64')
        
        form.append('doc', fileBase64)
        form.append('filename', filename || req.file.originalname)
        
        // Send signers exactly as received from frontend (already a JSON string)
        form.append('signers', signers)
        
        // Other fields
        if (signing_order !== undefined) {
            form.append('signing_order', signing_order.toString())
        }
        if (callback_url) {
            form.append('callback_url', callback_url)
        }
        if (is_signature_without_frame !== undefined) {
            form.append('is_signature_without_frame', is_signature_without_frame.toString())
        }

        const apiConfig = { 
            apiEndpoint: '/v2/esign/v1/documents/request_global_sign', 
            apiMethod : 'POST'
        }
        const hmacHeaders = HmacAuthService.generateHeaders(apiConfig)
        const { 'Content-Type': _, ...hmacHeadersWithoutContentType } = hmacHeaders;
        const headers = { 
            ...hmacHeadersWithoutContentType,
            ...form.getHeaders()
        }

        console.log('Sending raw signers string:', signers)

        const response = await apiClient.post ( 
            apiConfig.apiEndpoint, 
            form, 
            { headers }
        )
        res.status(response.status).json(response.data)

    } catch (error) { 
        console.error('eMeterai Stamp Error : ', error.response?.data || error.message)
        res.status(error.response?.status || 500).json({ 
            error: error.response?.data || 'Failed to apply eMeterai stamp',
            message: error.message 
        })
    }
}