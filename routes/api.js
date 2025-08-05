const express = require('express')
const router = express.Router()

const getController = require('../controllers/mekariGetController.js')
const postController = require('../controllers/mekariPostController.js')
const profileController = require('../controllers/profileController.js')

router.get('/profile', profileController.getMekariProfile)

router.get('/documents', getController.getDocumentLists)
router.get('/documents/:documentId', getController.getDocumentDetail)
router.get('/download-pdf/:documentId', getController.getDownload)

module.exports = router

router.post('/requestSign', postController.postRequestSign)