const UserController = require('../controller/user.controller');
const shopController = require('../controller/shop.controller')
const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const uploads = require('../middlewares/imageMulter.middleware')
const { addShopValidator } = require('../validator/Shop.validator')
const currentUser = require('../middlewares/currentuser.middleware')
const { addOffers } = require('../validator/offer.validator')
const { userRegister } = require('../validator/user.validator')
const { updateOffers } = require('../validator/offer.validator')
const userGuard = require('../middlewares/auth.middleware')

// login admin
router.post('/login', UserController.login);

//refreshToken
router.put('/update', UserController.tokenRefresh);

//add shop owners
router.post('/addShop', currentUser.currentUser, uploads.upload.single('shopFile'), addShopValidator, UserController.addShop)

// Edit Shop
router.put('/editShop/:id', currentUser.currentUser, uploads.upload.single('shopFile'), UserController.editShop);


// get shop owners
router.get('/getShop', UserController.getShop)


//get total shop count

router.get('/dataCount', currentUser.currentUser, UserController.dataCount)

//for activate user
router.put('/activate/:userId', currentUser.currentUser, UserController.activateUser);

//for in-active user
router.put('/deactivate/:userId', currentUser.currentUser, UserController.deactivateUser);

//delete shop

router.delete('/deleteShop/:id', currentUser.currentUser, UserController.deleteShop);
// add offers
router.post('/add-offers', currentUser.currentShop, addOffers, shopController.addOffer)

// update offers
router.put('/offers/:id', currentUser.currentShop, updateOffers, shopController.updateOffer)


// delete offers
router.delete('/offers/:id', shopController.deleteOffer)

//add master dish
router.post('/addMasterDish', currentUser.currentUser, uploads.upload.single('masterDishImage'), UserController.addMasterDish)

//edit master dish
router.put('/editMasterdish/:masterDishId', uploads.upload.single('masterDishImage'), UserController.editMasterDish)

//get master dish
router.get('/getMasterDish', UserController.getMasterDish)


router.delete('/deleteMasterDish/:id', currentUser.currentUser, UserController.deleteMasterdish)
// get users
router.get('/getUsers', UserController.getUsers)

// get Current user
router.get('/currentUser', currentUser.currentUser, UserController.currentUser)

// get users rankwise
router.get('/getUsersRankWise', UserController.getUsersRankWise)

// admin add table type
router.post('/addTableType', UserController.addTableType)

// admin edit table type
router.put('/editTableType/:id', UserController.updateTableType)

//admin delete table type
router.delete('/deleteTableType/:id', UserController.deleteTableType)

//admin get table type
router.get('/getTableType', UserController.getTableType)

//get shop offer
router.get('/getShopOffers', currentUser.currentShop, shopController.getShopOffers)

// user register
router.post('/register', userRegister, UserController.userRegister)

// getTrendingShops
router.get('/getTrendingShops', UserController.getTrendingShops)

// getShopsMasterDish
router.get('/getShopsMasterDish', UserController.getShopsMasterDish)

// get my orders
router.post('/getMyOrders', currentUser.currentUser, UserController.getMyOrders)

// user check-in
router.put('/orderCheckIn/:id', currentUser.currentUser, UserController.orderCheckIn)

// user check-out
router.put('/orderCheckOut/:id', currentUser.currentUser, UserController.orderCheckOut)

// top 5 dishes
router.get('/top5Dishes', UserController.top5Dishes)


// get dish booking history
router.get('/dishBookingHistory', UserController.dishBookingHistory)






module.exports = router;