// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {

  token: null,
  userdata:null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    storetoken: (state, action) => {
      state.token = action.payload;
    },
    storeuserdata:(state,action)=>{
        state.userdata = action.payload;
    }
  },
});

export const { storetoken, storeuserdata } = authSlice.actions;
export default authSlice.reducer;
