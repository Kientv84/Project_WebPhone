import { createSlice } from '@reduxjs/toolkit'

const initialState = {
<<<<<<< HEAD
    name: '',
    email: '',
    access_token: '',
    
}

export const userSlide = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const {name, email, access_token} = action.payload
            state.name = name || email;
            state.email = email;
            state.access_token = access_token;
        },
        resetUser: (state) => {
            state.name = '';
            state.email = '';
            state.access_token = '';
        },
=======
  name: '',
  email: '',
  phone: '',
  address: '',
  avatar: '',
  access_token: '',
  id: '',
  isAdmin : false,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const { name = '', email = '', access_token = '', address = '', phone = '', avatar = '',  _id = '', isAdmin} = action.payload
      // console.log('action', action)
      state.name = name ;
      state.email = email;
      state.phone = phone;
      state.address = address;
      state.avatar = avatar;
      state.id = _id;
      state.access_token = access_token;
      state.isAdmin = isAdmin;
    },
    resetUser: (state) => {
      // console.log('action', action)
      state.name = '';
      state.email = '';
      state.phone = '';
      state.address = '';
      state.avatar = '';
      state.id = '';
      state.access_token = '';
      state.isAdmin = false;

>>>>>>> 8ece943ba26e9c1ad9937dd7dea89df0fa71c1f3
    },
})

<<<<<<< HEAD
export const {updateUser, resetUser} =userSlide.actions
=======
// Action creators are generated for each case reducer function
export const { updateUser,  resetUser } = userSlice.actions

export default userSlice.reducer
>>>>>>> 8ece943ba26e9c1ad9937dd7dea89df0fa71c1f3
