const express = require('express');
const router= express.Router();
const TagsController = require('../Controller/tagsController.js');


router.post('/add/:lang', TagsController.addTags);
router.get('/getbyid/:id', TagsController.getTagsById)
router.get('/:lang', TagsController.getTagsByLang)

router.get('/', TagsController.getTags)
router.put('/update/:lang/:id', TagsController.updateTags);
router.delete('/delete/:lang/:id', TagsController.deleteTags);


module.exports =router