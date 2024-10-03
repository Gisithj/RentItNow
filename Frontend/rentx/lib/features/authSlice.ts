import { createSlice } from '@reduxjs/toolkit';
import { createAppSlice } from '../createAppSlice';
import { GET_USER } from '@/api/auth';
import { startConnection } from '@/utils/signalrService';
import { User } from '@/utils/interfaces';

// interface User{
//   id: string
//   username:string,
//   email:string
//   userRoles:string[]
// }
interface AuthState {
  isLoggedIn: boolean;
  user:User | null;
  status:String
}

const initialState: AuthState = {
  isLoggedIn: false,
  user:null,
  status:'no auth'
};

export const authSlice = createAppSlice({
  name: 'auth',
  initialState,
  reducers:(create) => ({
    login: create.asyncThunk(
      async (_: void) => {
        const response = await GET_USER();
        await startConnection();
        return response?.data
      },
      {
        pending: (state) => {
          state.isLoggedIn = false;
          state.status = "loading";
        },
        fulfilled: (state:AuthState, action) => {
          console.log("called login");
          console.log(action.payload);
          state.isLoggedIn = true;
          state.user = action.payload;
          state.status = "authorized";
        },
        rejected: (state) => {
          state.isLoggedIn = false;
          state.status = "failed";
        },
      },
    ),
    // login: create.reducer((state) => {
    //   console.log("called login");
    //   const user = await GET_USER
    //   state
    //   state.isLoggedIn = true;
    // }),
    logout:  create.reducer((state) => {
      console.log("called logout");
      state.isLoggedIn = false;
      localStorage.removeItem('token');
    }),
    checkAuth:  create.reducer((state) => {
      if (typeof window !== 'undefined') { // Check for window before access
        // state.isLoggedIn = !!localStorage.getItem('token');
      }
    }),
  }),
  selectors: {
    selectIsLoggedIn: (status) => status.isLoggedIn,
    selectUser: (status) => status.user,
  },
  
});

export const { login, logout, checkAuth } = authSlice.actions;
export const { selectIsLoggedIn, selectUser } = authSlice.selectors;

export default authSlice.reducer;
