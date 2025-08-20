exports.handleDocumentUploadCallback = async (req, res) => {
  try {
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
    console.log('Request body type:', typeof req.body);
    
    // Your existing logic
    console.log('Callback Received! : ', req.body);
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Callback Error : ', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || 'Internal server error (Callback)',
      message: error.message
    });
  }
};