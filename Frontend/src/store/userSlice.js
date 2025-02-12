/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";



const userSlice = createSlice({
    name: 'user',
    initialState: {
        users: [],
        loading: false,
        error: null
    },
    reducers: {
      addUser:(state,action)=>{
          state.users.push(action.payload);
      }
    }
})

export const { addUser } = userSlice.actions;

export default userSlice.reducer;