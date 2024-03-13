import { createSlice } from '@reduxjs/toolkit';
import { createAppSlice } from '../createAppSlice';

interface navbarState {
    activeSideBarTab: string;
}

const initialState: navbarState = {
    activeSideBarTab: "home",
};

export const sidebarSlice = createAppSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setActiveSidebarTab: (state,action) => {            
      state.activeSideBarTab = action.payload;
    },
   
  },
  selectors: {
    selectActiveSideBar: (status) => status.activeSideBarTab,
  },
});

export const { setActiveSidebarTab } = sidebarSlice.actions;
export const { selectActiveSideBar  } = sidebarSlice.selectors;

export default sidebarSlice.reducer;
