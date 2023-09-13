import { createSlice } from "@reduxjs/toolkit";
import produce from "immer";

const shopSlice = createSlice({
  name: "Shop",
  initialState: {
    shop: {
      id: null,
      myshopifyDomain: null,
      zone:null,
      name:null
    },
    settings: null,
    currentPlan:null,
  },
  reducers: {
    setShop: (state, { payload }) => {
      state.shop = payload.shop;
      state.settings = payload.settings;
      state.currentPlan = payload.currentPlan;
    },
    setSettings:(state, {payload})=>{
      state.settings = payload;
    },
    updateSetting: (state, { payload }) => {
      if (typeof payload.key != "string") return state;
      const keys = payload.key.split(".");
      return produce(state, (draft) => {
        let currentPart = draft.settings;
        for (let i = 0; i < keys.length; i++) {
          if (i === keys.length - 1) {
            currentPart[keys[i]] = payload.value;
          } else {
            currentPart[keys[i]] = currentPart[keys[i]] || {};
            currentPart = currentPart[keys[i]];
          }
        }
      });
    },
  },
});

export const { setShop, updateSetting, setSettings } = shopSlice.actions;
export default shopSlice.reducer;
