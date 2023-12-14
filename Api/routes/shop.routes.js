const ShopController = require('../controller/shop.controller');
const router = require('express').Router();
const uploads = require('../middlewares/imageMulter.middleware');
const { timeSlotValidator } = require('../validator/timeslot.validator')
const currentUser = require('../middlewares/currentuser.middleware')
const UserController = require('../controller/user.controller')


// get shop details
router.get('/shpDetails/:id', ShopController.getShopDetails);

//add dish
router.post('/addDish', uploads.upload.single('DishImage'), ShopController.addDish);

//delete dish
router.delete('/deleteDish/:id', currentUser.currentShop, ShopController.deleteDish);

//get dish
router.get('/getDish', ShopController.getDish)

//get dish shopwise
router.get('/getDishShopwise', currentUser.currentShop, ShopController.getDishShopwise)

//get dish based on filter and for search
router.post('/getDishFilter', ShopController.getDishFilter)

// get dish based on filer in shops
router.post('/getDishFilterShopwise', ShopController.getDishFilterShopwise)

// login shop
router.post('/shopLogin', ShopController.shopLogin);

//add time slot
router.post('/addTimeslot', currentUser.currentShop, timeSlotValidator, ShopController.addTimeSlot);

router.post('/getTimeslot', ShopController.getTimeSlot)

//add shop tables
router.post('/addShopTables', currentUser.currentShop, ShopController.addShopTables)

//list shop tables
router.post('/getShopTables/:id', ShopController.getShopTables)

//book a table in shop
router.post('/bookTable', currentUser.currentUser, ShopController.bookTable)

// get shop owners for users
router.get('/getShop', UserController.getShop)

//orderDishDetails
router.post('/orderDishDetails/:id', ShopController.orderDishDetails)



module.exports = router;
