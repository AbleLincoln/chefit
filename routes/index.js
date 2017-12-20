const express = require('express');
const router = express.Router();

const bookerController = require('../controllers/bookerController')

/* GET */
router.get('/', bookerController.homePage);
router.get('/submitted', bookerController.submitted);

/* POST */
router.post('/square', bookerController.square);

module.exports = router;
