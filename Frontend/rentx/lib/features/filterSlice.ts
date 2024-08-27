import { createSlice } from '@reduxjs/toolkit';
import { createAppSlice } from '../createAppSlice';

interface categoryFilter {
    selectedCategories: string[];
    isNotRented: boolean;
    availabilityDateRange: {
      startDate: string;
      endDate: string;
    };
}

const initialState: categoryFilter = {
    selectedCategories: [],
    isNotRented: false,
    availabilityDateRange: {
      startDate: Date.now().toString(),
      endDate: Date.now().toString()
    }
};

export const filterSlice = createAppSlice({
  name: 'filterSlice',
  initialState,
  reducers: {
    setSelectedCategories : (state,action) => {            
      state.selectedCategories = action.payload;
    },
    setIsNotRented : (state,action) => {        
      console.log("in here slice for not rented");
      
      console.log(action.payload);     
      state.isNotRented = action.payload;
    },
    setAvailabilityDateRange : (state,action) => {      
      console.log("in here slice for setAvailabilityDateRange");
      
      console.log(action.payload); 
      state.availabilityDateRange = action.payload;
    },
   
  },
  selectors: {
    selectedFilteredCategories: (status) => status.selectedCategories,
    selectIsNotRented: (status) => status.isNotRented,
    selectAvailabilityDateRange:(status) => status.availabilityDateRange
  },
});

export const { setSelectedCategories , setIsNotRented ,setAvailabilityDateRange } = filterSlice.actions;
export const { selectedFilteredCategories , selectIsNotRented,selectAvailabilityDateRange} = filterSlice.selectors;

export default filterSlice.reducer;
