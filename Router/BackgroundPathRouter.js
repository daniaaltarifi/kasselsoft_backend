const express = require('express');
const router= express.Router();
const BackgroundPathController = require('../Controller/BackgroundPathController.js');


// router.post('/add/:lang', BackgroundPathController.addBackgroundPath);
router.get('/:lang/:path', BackgroundPathController.getbackgroundpathByLang)
router.get('/:lang', BackgroundPathController.getbackgroundpathByJustLang)
router.get('/', BackgroundPathController.getbackgroundpath)
router.put('/update/:lang/:id', BackgroundPathController.updatebackgroundpath);


module.exports =router