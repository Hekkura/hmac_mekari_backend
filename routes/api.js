const express = require('express')
const router = express.Router()

const getController = require('../controllers/mekariGetController.js')
const postController = require('../controllers/mekariPostController.js')
const profileController = require('../controllers/profileController.js')

router.get('/Mekariprofile', profileController.getMekariProfile)
router.get('/getProfile', profileController.getProfileData) //change names
router.post('/postProfile',profileController.postProfileData) //change names
router.delete('/delProfile', profileController.deleteProfileData) //change names

router.get('/documents', getController.getDocumentLists)
router.get('/documents/:documentId', getController.getDocumentDetail)
router.get('/download-pdf/:documentId', getController.getDownload)

module.exports = router

router.post('/requestSign', postController.postRequestSign)