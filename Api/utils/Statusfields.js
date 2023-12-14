const categoryStatus = {
    NON_VEG: 1,
    VEG: 2,
    JUICE: 3

}

const welcomeOffer = {
    NOT_CREDITED: 0,
    CREDITED: 1,
    REDEEMED: 3
}

const offerStatus = {
    ADMIN: 1,
    Shop: 2,
    GIFTCARD: 3

}

const tableStatus = {
    AVAILABLE: 1,
    INACTIVE: 2,
    INPROGRESS: 3,
    BOOKED: 4
}

const orderStatus = {
    PLACED: 1,
    PENDING: 2,
    ACCEPTED: 3,
    FINISHED: 4,
    CANCELED: 5,
    EXPIRED: 6
}

const shopStatus = {
    open: 0,
    closed: 1
}

const checkedStatus = {
    notSpecified: 0,
    checkedIn: 1,
    Checkout: 2,
}

module.exports = { categoryStatus, welcomeOffer, offerStatus, tableStatus, orderStatus, shopStatus, checkedStatus }