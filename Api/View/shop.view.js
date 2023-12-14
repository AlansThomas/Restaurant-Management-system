class GetUserView {
  constructor(data) {

    this.shopId = data.shopId;
    this.shopName = data.shop.shopName;
    this.email = data.shop.email;
    this.phoneNumber = data.shop.phoneNumber;
    this.trending = data.shop.trending;
    this.masterdishID = data.masterdish.id;
    this.masterDishName = data.masterdish.masterDishName;
    this.masterDishImage = data.masterdish.masterDishImage;
    this.masterOfferStatus = data.masterdish.offerStatus;
    this.dishId = data.id;
    this.dishName = data.dishName;
    this.discription = data.discription;
    this.dishImage = data.dishImage;
    this.rating = data.rating;
    this.price = data.price;
    this.dishQuantity = data.dishQuantity;
    this.categoryStatus = data.categoryStatus;
    this.dishTrending = data.trending;
    this.dishOfferStatus = data.offerStatus;






  }

}

class GetUserViewsCollection {
  constructor(dataArray) {
    this.userViews = [];
    for (const shopData of dataArray) {
      const userView = new GetUserView(shopData);
      this.userViews.push(userView);
    }
  }
}
class Table {
  constructor(data) {
    if (data.dataValues) {
      this.bookingStatus = data.bookedStatus;
    }
    this.tableName = data.dataValues.tableName;
    this.tableId = data.id;
    this.noOfSeat = data.table_type.noOfSeats;
    if (data.id == null || undefined) {
      this.tableId = data.dataValues.shopTableId;
    } else {
      this.tableId = data.id;
    }
  }
}



class GetTableView1 {
  constructor(data) {
    this.view = [];
    for (const element of data) {
      const firstView = new Table(element);
      this.view.push(firstView);
    }
  }
}

class GetTrndingShops {

  constructor(data) {
    console.log(data, "5678");
    this.view = [];
    for (const element of data) {
      const firstView = new ResultTrendingShops(element);
      this.view.push(firstView);
      // const firstView = new ResultTrendingShops(element);
      // this.view.push(firstView);
    }
  }
}

class ResultTrendingShops {
  constructor(data) {
    console.log(data.count, "!!!!");
    this.shopId = data?.dataValues.id;
    this.shopName = data?.dataValues.shopName;
    this.status = data?.dataValues.status;
    this.createdAt = data?.dataValues.createdAt;
    this.updatedAt = data?.dataValues.updatedAt;
    this.count = data?.count

  }
}

class GetOrderHistoryView {
  constructor(data) {
    this.ordersWithDishes = data.ordersWithDishes.map(order => ({
      orderDetails: order.orderDetails,
      dishes: order.dishes.map(dish => dish.dish)
    }));
  }
}





// Export the class
module.exports = { GetUserView, GetUserViewsCollection, GetTableView1, GetTrndingShops, GetOrderHistoryView };
