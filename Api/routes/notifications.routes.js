const notificationController = require('../controller/notification.contoller');
const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const uploads = require('../middlewares/imageMulter.middleware')
const currentUser = require('../middlewares/currentuser.middleware')


router.get('/getNoti', currentUser.currentUser, notificationController.getNotifications)

router.get('/getNotiShop', currentUser.currentShop, notificationController.getNotificationsShop)

router.put('/mark-all-read', currentUser.currentUser, notificationController.markAllMessageAsRead)

router.put('/mark-one-read/:id', currentUser.currentUser, notificationController.markOneMessageAsRead)

module.exports = router;