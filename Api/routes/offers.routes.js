const router = require('express').Router();
const offersController = require('../controller/offers.controller');
const currentUser = require('../middlewares/currentuser.middleware')



router.post('/giftCards', currentUser.currentUser, offersController.giftCards)

router.get('/giftCards', offersController.getGiftCards)

router.delete('/deleteCard/:id', currentUser.currentUser, offersController.DeleteGiftCard);

router.get('/updateTableStatus', offersController.updateTableStatus)

module.exports = router;