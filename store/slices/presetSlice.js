import { createSlice } from "@reduxjs/toolkit";
import produce from "immer";

const presetSlice = createSlice({
  name: "Preset",
  initialState: {
    loading:false,
    name:'',
    selectedProducts: [],
    openingTime: { time: "00:00", format: "AM" },
    closingTime: { time: "00:00", format: "PM" },
    gap: { value: 60, format: "minutes" },
    maintenanceTime: { value: 0, format: "minutes" },
    duration: [{ hours: 1, price: 0 }],
    isEditable:false
  },
  reducers: {
    setPreset:(state,{payload})=>{
      console.log('payload', payload)
      Object.entries(payload)?.forEach(([key,value])=>{
        console.log(key)
        state[key] = payload[key]
      })
    },
    addSelectedProduct: (state, action) => {
      state.selectedProducts.push(action.payload)
    },
    setName: (state, action) => {
      state.name = action.payload
    },
    removeSelectedProduct: (state, action) => {
      const id = action.payload
      console.log(id)
     state.selectedProducts = state.selectedProducts.filter(({node})=>node.id !== id  )
    },
    setOpeningTime: (state, action) => {
      state.openingTime.time = action.payload.time;
      state.openingTime.format = action.payload.format;
    },
    setClosingTime: (state, action) => {
      state.closingTime.time = action.payload.time;
      state.closingTime.format = action.payload.format;
    },
    setGap: (state, action) => {
      state.gap.value = action.payload.value;
      state.gap.format = action.payload.format;
    },
    setMaintenanceTime: (state, action) => {
      state.maintenanceTime.value = action.payload.value;
      state.maintenanceTime.format = action.payload.format;
    },
    setMaintenanceTime: (state, action) => {
      state.maintenanceTime.value = action.payload.value;
      state.maintenanceTime.format = action.payload.format;
    },
    addDuration: (state, action) => {
      state.duration.push({ hours: 0, price: 0 });
    },
    removeDuration: (state, { payload: index }) => {
      if (state.duration.length > 1 && index !== -1) {
        state.duration.splice(index, 1);
      }
    },
    editDuration: (state, action) => {
      const {value, index, target} = action.payload
      return produce(state, (draftState) => {
        draftState.duration[index][target] = value;
      });
    },
    resetState: (state, action) => {
        state.loading = false,
        state.name =  '', 
        state.selectedProducts =  [],
        state.openingTime =  { time: "00:00", format: "AM" },
        state.closingTime =  { time: "00:00", format: "PM" },
        state.gap =  { value: 60, format: "minutes" },
        state.maintenanceTime = { value: 0, format: "minutes" },
        state.duration =  [{ hours: 1, price: 0 }],
        state.isEditable = false
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  addSelectedProduct,
  removeSelectedProduct,
  setOpeningTime,
  setClosingTime,
  setGap,
  setMaintenanceTime,
  addDuration,
  removeDuration,
  editDuration,
  setLoading,
  setPreset,
  setName,
  resetState,
} = presetSlice.actions;
export default presetSlice.reducer;
