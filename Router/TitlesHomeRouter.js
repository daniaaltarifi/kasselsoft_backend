const express = require('express');
const router= express.Router();
const TitlesHomeController = require('../Controller/TitlesHomeController.js');


router.post('/add/:lang', TitlesHomeController.addTitlesHome);
router.get('/:lang', TitlesHomeController.getTitlesHomeByLang)
router.get('/getbyid/:id', TitlesHomeController.getTitleshomeById)

router.get('/', TitlesHomeController.getTitleshome)
router.put('/update/:lang/:id', TitlesHomeController.updateTitleshome);


module.exports =router