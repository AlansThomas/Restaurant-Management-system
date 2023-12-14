// searchValueSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchValue1: '',
  searchValue2: '',
};

const searchValueSlice = createSlice({
  name: 'searchValue',
  initialState,
  reducers: {
    setSearchValue1: (state, action) => {
      state.searchValue1 = action.payload;
    },
    setSearchValue2: (state, action) => {
      state.searchValue2 = action.payload;
    },
  },
});

export const { setSearchValue1, setSearchValue2 } = searchValueSlice.actions;
export const getCmp1SearchValue = (state) => state.searchValue.searchValue1;
export const getCmp2SearchValue = (state) => state.searchValue.searchValue2;
export default searchValueSlice.reducer;
