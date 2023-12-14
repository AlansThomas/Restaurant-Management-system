
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    dishId: [],
    shopId: ''
};

const dishIdSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        setDishId: (state, action) => {
            state.dishId = action.payload;
        },
        setShopId: (state, action) => {
            state.shopId = action.payload;
        },
        removeDishId: (state, action) => {
            const idToRemove = action.payload;
            state.dishId = state.dishId.filter(id => id !== idToRemove);
        },

    },
});

export const { setDishId, setShopId, removeDishId } = dishIdSlice.actions;
export const selectDishId = (state) => state.orders.dishId;
export const selectShopId = (state) => state.orders.shopId;


export default dishIdSlice.reducer;
