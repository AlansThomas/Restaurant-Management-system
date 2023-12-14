const Notification = require('../models/notification.model')
const ERROR_CODES = require('../utils/errorCodes.utils')
const ERROR_MESSAGES = require('../utils/errorMessages.utils');

//GET NOTIFICATION
const getNotifications = async (req, res, next) => {

    try {
        const notifications = await Notification.findAll({
            where: { userId: req.currentUserObj?.userID },
            order: [['createdAt', 'DESC']],
        })
        return res.status(200).send(notifications)
    }
    catch (err) {
        return next(res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        }))
    }
}

// SHOP NOTIFICATION
const getNotificationsShop = async (req, res, next) => {

    try {
        const notifications = await Notification.findAll({ where: { shopId: req.currentUserObj?.shopID } })
        return res.status(200).send(notifications)
    }
    catch (err) {
        return next(res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        }))
    }
}

// MARK ALL MESSAGE
const markAllMessageAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findAll({
            where: {
                userId: req.currentUserObj?.userID
            },
            order: [['createdAt', 'DESC']],
        })
        if (!notification) {
            return res.status(404).json({
                errorCode: ERROR_CODES.NOTIFICATION_NOT_FOUND,
                message: ERROR_MESSAGES.NOTIFICATION_NOT_FOUND
            })
        }
        else {
            const data = {
                isRead: true
            }
            await Notification.update(data, {
                where: {
                    userId: req.currentUserObj?.userID
                }
            })
            return res.status(200).send("All Messages Read")
        }
    }
    catch (err) {
        return next(res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        }))
    }
}

//MARK ONE MESSAGE
const markOneMessageAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findOne({
            where: {
                id: req.params.id,
                userId: req.currentUserObj?.userID
            }
        })
        if (!notification) {
            return res.status(404).json({
                errorCode: ERROR_CODES.NOTIFICATION_NOT_FOUND,
                message: ERROR_MESSAGES.NOTIFICATION_NOT_FOUND
            })
        }
        else {
            const data = {
                isRead: true
            }
            await Notification.update(data, {
                where: {
                    id: req.params.id,
                    userId: req.currentUserObj?.userID

                }
            })
            return res.status(200).send("Message marked as read")
        }
    }
    catch (err) {
        return next(res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        }))
    }
}

module.exports = { getNotifications, getNotificationsShop, markAllMessageAsRead, markOneMessageAsRead }