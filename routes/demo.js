const express = require('express')
const router = express.Router()
const DemoController = require('../controllers/DemoController')

router.get('/',  DemoController.getDemo)


module.exports = router