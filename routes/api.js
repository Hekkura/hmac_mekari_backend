const express = require('express')
const router = express.Router()

const getController = require('../controllers/mekariGetController.js')

router.get('/profile', getController.getProfile)
router.get('/documents', getController.getDocumentLists)
router.get('/documents/:documentId', getController.getDocumentDetail)
router.get('/download-pdf/:documentId', getController.getDownload)
module.exports = router