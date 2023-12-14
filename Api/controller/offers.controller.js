
const Offer = require('../models/offer.model');
const OrderHistory = require('../models/orderhistory.model');
const ShopTimeSlot = require('../models/shoptimeslot.model');
const ShopTable = require('../models/shoptable.model');

const { validationResult } = require('express-validator');
const schedule = require('node-schedule');
const { Op } = require('sequelize');

const ERROR_CODES = require('../utils/errorCodes.utils')
const ERROR_MESSAGES = require('../utils/errorMessages.utils');
const StatusFiled = require('../utils/Statusfields')
const STATUS = require('../utils/status.util');



const currentDate = new Date().toISOString().split('T', 1)[0];    // to find current date

const CurrentBookDate = new Date().toISOString().slice(0, 10);
const currentHour = new Date().getHours();



//ADD GIFTCARD
const giftCards = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send(errors.errors[0].msg);
    }
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);

    if (startDate < currentDate) {
        return res.status(400).json({
            errorCode: ERROR_CODES.INVALID_DATE_FORMAT,
            message: ERROR_MESSAGES.INVALID_DATE_FORMAT
        });
    }
    if (endDate < startDate) {
        return res.status(400).json({
            errorCode: ERROR_CODES.END_DATE_GREATER_THAN_START_DATE,
            message: ERROR_MESSAGES.END_DATE_GREATER_THAN_START_DATE
        });
    }

    let offers = {
        offerName: req.body.offerName,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        discount: req.body.discount,
        offerType: StatusFiled.offerStatus.GIFTCARD,
        status: currentDate >= startDate && currentDate <= endDate ? STATUS.ACTIVE : STATUS.INACTIVE,
    };

    try {
        await Offer.create(offers);
        res.status(200).json({ offers });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        });
    }
};

//GET GIFTCARD 
const getGiftCards = async (req, res, next) => {
    try {
        const giftCards = await Offer.findAll({
            where: {
                offer_type: StatusFiled.offerStatus.GIFTCARD,
                status: STATUS.ACTIVE
            }
        })
        res.status(200).json({ giftCards })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        });
    }
}

//DELETE GIFTCARD
const DeleteGiftCard = async (req, res, next) => {

    try {
        const offer = await Offer.findOne({
            where: {
                id: req.params.id,
                offer_type: StatusFiled.offerStatus.GIFTCARD
            }
        });
        if (!offer) {
            res.status(404).json({
                errorCode: ERROR_CODES.OFFER_NOT_FOUND,
                message: ERROR_MESSAGES.OFFER_NOT_FOUND
            })
        }
        else {
            await Offer.destroy({
                where: {
                    Id: req.params.id,
                    offer_type: StatusFiled.offerStatus.GIFTCARD
                },
            });
            res.status(200)
                .json({
                    message: "giftcard deleted successfully.."
                })
        }
    }
    catch (error) {
        res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        });
    }


}

//UPDATE OFFER STATUS
const updateOffersStatus = async () => {
    try {
        const offersToUpdate = await Offer.findAll({
            where: {
                [Op.or]: [
                    { endDate: { [Op.lt]: currentDate }, status: STATUS.ACTIVE },
                    { startDate: { [Op.lte]: currentDate }, status: STATUS.INACTIVE }
                ]
            }
        });

        for (const offer of offersToUpdate) {
            if (offer.endDate < currentDate) {
                offer.status = STATUS.INACTIVE;
            } else if (offer.startDate <= currentDate) {
                offer.status = STATUS.ACTIVE;
            }
            await offer.save();
        }

        console.log('Offers status updated successfully');
    } catch (error) {
        console.error('Error updating offers status:', error);


    }
};


//UPDATE TABLE STATUS
const updateTableStatus = async (req, res, next) => {
    try {
        const tablesToUpdate = await OrderHistory.findAll({
            where: { status: STATUS.ACTIVE },
            include: [ShopTimeSlot, ShopTable]
        });



        for (const table of tablesToUpdate) {

            if (table.bookedDate < CurrentBookDate) {
                await ShopTable.update(
                    { bookedStatus: StatusFiled.tableStatus.AVAILABLE },
                    { where: { id: table.shop_table.id } }
                );
            }

            if (table.bookedDate >= CurrentBookDate) {
                await ShopTable.update(
                    { bookedStatus: StatusFiled.tableStatus.BOOKED },
                    { where: { id: table.shop_table.id } }
                );
            }

            if (table.bookedDate == CurrentBookDate && table.shop_timeslot.endTime < currentHour) {
                await ShopTable.update(
                    { bookedStatus: StatusFiled.tableStatus.AVAILABLE },
                    { where: { id: table.shop_table.id } }
                );
            }

        }

        console.log('Table status updated successfully');
        res.status(200).json({ message: 'Table status updated successfully' });
    } catch (error) {
        console.error('Error updating table status:', error);
        res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        });
    }
};



schedule.scheduleJob('0  * * *', updateOffersStatus);  //  batch runs once in a day

// schedule.scheduleJob('* * * * *', updateTableStatus);


module.exports = { giftCards, getGiftCards, DeleteGiftCard, updateTableStatus }
