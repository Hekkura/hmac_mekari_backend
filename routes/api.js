const express = require('express')
const router = express.Router()
const {upload, handleMulterError} = require('../middleware/upload.js')

const getController = require('../controllers/mekariGetController.js')
const postController = require('../controllers/mekariPostController.js')
const profileController = require('../controllers/profileController.js')


// Profiles
router.get('/Mekariprofile', profileController.getMekariProfile)
router.get('/getProfile', profileController.getProfileData) //change names
router.post('/postProfile',profileController.postProfileData) //change names
router.delete('/delProfile', profileController.deleteProfileData) //change names

// Get Routes
router.get('/documents', getController.getDocumentLists)
router.get('/documents/:documentId', getController.getDocumentDetail)
router.get('/download-pdf/:documentId', getController.getDownload)

// Post Route
router.post('/documents/upload',
    upload.single('doc'), // 'doc' is the key name of the file field in form-data
    handleMulterError, 
    postController.postUploadDoc
)
router.post('/requestSign', postController.postRequestSign)


module.exports = router

