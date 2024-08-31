import { createSlice } from "@reduxjs/toolkit";

const initialState= {
  currentUser:null,
  error:null,
  loading:false
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
        state.loading=true
        state.error=false
    },
    signInSuccess: (state,action) => {
      state.currentUser=action.payload
      state.error=null
      state.loading=false
    },
    signInFailure: (state,action) => {
      state.error=action.payload
      state.loading=false
    },
    updateStart:(state)=>{
      state.loading=true
      state.error=false
    },
    updateSucess:(state,action)=>{
      state.currentUser=action.payload
      state.loading=false
      state.error=null
    },
    updateFailure:(state,action)=>{
      state.error=action.payload
      state.loading=false
    },
    deleteStart:(state)=>{
      state.loading=true
      state.error=false
    },
    deleteSucess:(state)=>{
      state.currentUser=null
      state.loading=false
      state.error=false
    },
    deleteFailure:(state,action)=>{
      state.error=action.payload
      state.loading=false
    },
    signOoutSuccess:(state)=>{
      state.currentUser=null
      state.loading=false
      state.error=null
    },
    resetLoading:(state)=>{
      state.loading=false
    }
  },
})

export const {signOoutSuccess, signInStart,signInSuccess,signInFailure,updateStart,updateSucess,updateFailure,deleteStart,deleteSucess,deleteFailure } = userSlice.actions
export default userSlice.reducer