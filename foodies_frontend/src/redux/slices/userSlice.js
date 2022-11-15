import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'counter',
  initialState: {
    access: '',
    refresh: ''
  },
  reducers: {
    login: (state, action) => {
      state.access = action.payload.access
      state.refresh = action.payload.refresh
    },
    logout: (state) => {
      state.is_contributor = false
      state.email = ''
      state.id = 0
      state.profile_photo = ''
      state.profile_description = ''
      state.username = ''
      state.refresh = ''
      state.access = ''
      localStorage.clear()
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
  }
  }
})


export const { login, logout } = userSlice.actions

export default userSlice.reducer