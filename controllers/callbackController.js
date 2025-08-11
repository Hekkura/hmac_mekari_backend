
exports.handleDocumentUploadCallback = async (req, res) => {
    try { 
        console.log("Callback Received! : ", req.body)
    } catch (error) { 
        console.error('Callback Error : ', error.response?.data || error.message)
        res.status(error.response?.status || 500).json({ 
            error: error.response?.data || 'Internal server error (Callback)',
            message: error.message 
        })
    }
} 