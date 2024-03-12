import { createSlice } from '@reduxjs/toolkit';
import { createAppSlice } from '../createAppSlice';

interface navbarState {
    activeNavBar: string;
}

const initialState: navbarState = {
  activeNavBar: "home",
};

export const navbarSlice = createAppSlice({
  name: 'navbar',
  initialState,
  reducers: {
    setActiveTab: (state,action) => {            
      state.activeNavBar = action.payload;
    },
   
  },
  selectors: {
    selectActiveNavBar: (status) => status.activeNavBar,
  },
});

export const { setActiveTab } = navbarSlice.actions;
export const { selectActiveNavBar  } = navbarSlice.selectors;

export default navbarSlice.reducer;
