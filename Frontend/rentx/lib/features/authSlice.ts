import { createSlice } from '@reduxjs/toolkit';
import { createAppSlice } from '../createAppSlice';

interface AuthState {
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  isLoggedIn: false, // Check for window first
};

export const authSlice = createAppSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state) => {
      console.log("called login");
      
      state.isLoggedIn = true;
    },
    logout: (state) => {
      console.log("called logout");
      state.isLoggedIn = false;
      // localStorage.removeItem('token');
    },
    checkAuth: (state) => {
      if (typeof window !== 'undefined') { // Check for window before access
        // state.isLoggedIn = !!localStorage.getItem('token');
      }
    },
  },
  selectors: {
    selectIsLoggedIn: (status) => status.isLoggedIn,
  },
});

export const { login, logout, checkAuth } = authSlice.actions;
export const { selectIsLoggedIn  } = authSlice.selectors;

export default authSlice.reducer;
