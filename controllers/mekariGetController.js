const apiClient = require('../services/apiMekari.js')
const HmacAuthService = require('../services/hmacAuthService.js')

//Get Profile
exports.getProfile = async(req, res) => { 
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

//Get Document Lists
exports.getDocumentLists = async(req, res) => { 
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