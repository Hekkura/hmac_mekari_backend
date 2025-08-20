const express = require('express')
const router = express.Router()
const {upload, handleMulterError} = require('../middleware/upload.js')

const getController = require('../controllers/mekariGetController.js')
const postController = require('../controllers/mekariPostController.js')
const profileController = require('../controllers/profileController.js')
const callbackController = require('../controllers/callbackController.js')
const stampController = require('../controllers/postStampController.js')
const signController = require('../controllers/postSignController.js')


// Profiles ================================
router.get('/mekariProfile', profileController.getMekariProfile)
router.get('/getProfile', profileController.getProfileData) //change names
router.post('/postProfile',profileController.postProfileData) //change names
router.delete('/delProfile', profileController.deleteProfileData) //change names

// Get Routes ==============================
router.get('/documents', getController.getDocumentLists)
router.get('/documents/:documentId', getController.getDocumentDetail)
router.get('/download-pdf/:documentId', getController.getDownload)

// Post Routes =================================
router.post('/documents/upload',
    upload.single('doc'), // 'doc' is the key name of the file field in form-data
    handleMulterError, 
    postController.postUploadDoc
)

// request sign ==================================
router.post('/requestSign', signController.postRequestSign)
router.post('/requestSign-test',
    upload.single('doc'),
    handleMulterError,
    signController.postRequestSignTEST_RailsStyle
    // postController.postRequestSignTEST
    )

// request stamp ===================================
router.post('/requestStamp', stampController.postStamp)
router.post('/requestStamp-test',
    upload.single('doc'),
    handleMulterError,
    stampController.postStampTEST
)
router.post('/requestStamp-Form',
    upload.single('doc'),
    handleMulterError,
    stampController.postStampFormData
)

// Callback Routes =============================
router.post('/documents/callback', express.json(), callbackController.handleDocumentUploadCallback)
// router.post('/documents/callback', express.json(), (req, res) => {
//     console.log('🔥 Callback hit!');
//     console.log('Headers:', req.headers);
//     console.log('Body:', req.body);
//     res.sendStatus(200).send('OK');
// });

module.exports = router

