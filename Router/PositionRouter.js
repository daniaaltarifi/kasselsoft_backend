const express = require('express');
const router= express.Router();
const PositionController = require('../Controller/PositionController.js');


router.post('/add', PositionController.addposition);
router.get('/getbyid/:id', PositionController.getpositionById)

router.get('/', PositionController.getposition)
router.put('/update/:id', PositionController.updateposition);


module.exports =router