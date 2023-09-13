import { configureStore, combineReducers } from "@reduxjs/toolkit";
import ordersReducer from "./slices/ordersSlice";
import customBookingReducer from "./slices/customBookingSlice";
import presetReducer from "./slices/presetSlice";
import ShopReducer from "./slices/shopSlice";

const rootReducer = combineReducers({
    orders:ordersReducer,
    customBooking:customBookingReducer,
    preset:presetReducer,
    shop:ShopReducer,
})
export default  configureStore({
    reducer:rootReducer
})
