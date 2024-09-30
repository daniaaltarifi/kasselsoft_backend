const express = require('express');
const router= express.Router();
const SubscribeController = require('../Controller/SubscribeController.js');
router.post('/add',SubscribeController.addSubscribe)
router.get('/',SubscribeController.getSubscribed)
router.delete('/delete/:id',SubscribeController.deletesSubscribed)
module.exports = router
