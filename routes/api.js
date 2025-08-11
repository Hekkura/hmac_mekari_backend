const express = require('express')
const router = express.Router()
const {upload, handleMulterError} = require('../middleware/upload.js')

const getController = require('../controllers/mekariGetController.js')
const postController = require('../controllers/mekariPostController.js')
const profileController = require('../controllers/profileController.js')
const callbackController = require('../controllers/callbackController.js')

// Profiles
router.get('/Mekariprofile', profileController.getMekariProfile)
router.get('/getProfile', profileController.getProfileData) //change names
router.post('/postProfile',profileController.postProfileData) //change names
router.delete('/delProfile', profileController.deleteProfileData) //change names

// Get Routes
router.get('/documents', getController.getDocumentLists)
router.get('/documents/:documentId', getController.getDocumentDetail)
router.get('/download-pdf/:documentId', getController.getDownload)

// Post Routes
router.post('/documents/upload',
    upload.single('doc'), // 'doc' is the key name of the file field in form-data
    handleMulterError, 
    postController.postUploadDoc
)
router.post('/requestSign', postController.postRequestSign)

// Callback Routes
// router.post('/documents/callback', express.json(), callbackController.handleDocumentUploadCallback)
router.post('/documents/callback', express.json(), (req, res) => {
    console.log('🔥 Callback hit!');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    res.sendStatus(200).send('OK');
});

module.exports = router

