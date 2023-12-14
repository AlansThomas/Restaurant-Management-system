import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    navState: {}
}

export const counterSlice = createSlice({
    name: 'navState',
    initialState,
    reducers: {
        setNavState: (state, action) => {

            state.navState = action.payload;
        }
    },
})

export const { setNavState } = counterSlice.actions
export const getNavState = (state) => state?.navState?.setNavState;

export default counterSlice.reducer