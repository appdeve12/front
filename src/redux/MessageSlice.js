
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  Message: [],
};

const MessageSlice = createSlice({
  name: 'Message',
  initialState,
  reducers: {
    storeMessage: (state, action) => {
      state.Message = action.payload;
    },
  },
});

export const { storeMessage } = MessageSlice.actions;
export default MessageSlice.reducer;
