import { GET_ITEM_BY_ID_WITH_INCLUDE, GET_ITEMS_BY_RENTER_WITH_INCLUDE, GET_RENTED_ITEMS_BY_RENTER_WITH_INCLUDE } from '@/api/item';
import { GetItem, RentalItem } from '@/utils/interfaces';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunks to fetch the lists
export const fetchRentedItemsByRoleId = createAsyncThunk(
    'updateTrigger/fetchRentedItemsByRoleId',
    async (roleId:string) => {
      try {        
        const response = await GET_RENTED_ITEMS_BY_RENTER_WITH_INCLUDE(roleId);
        return response;
      } catch (error) {
        throw error        
      }
    }
  );
export const fetchItemsByRoleId = createAsyncThunk(
    'updateTrigger/fetchItemsByRoleId',
    async (roleId:string) => {
      const response = await GET_ITEMS_BY_RENTER_WITH_INCLUDE(roleId);
      return response;
    }
  );
export const fetchItemByIdWithInclude = createAsyncThunk(
    'updateTrigger/fetchItemByIdWithInclude',
    async (productId:string) => {
      const response = await GET_ITEM_BY_ID_WITH_INCLUDE(productId);
      return response;
    }
  );

  interface UpdateState {
    rentalRequestList: RentalItem[],
    rentalItemList: GetItem[],
    itemWithInclude:GetItem | null,
    status: {
      rentalRequestList: string,
      rentalItemList: string,
      itemWithInclude:string,
    },
    error: {
      rentalRequestList: null,
      rentalItemList: null,
      itemWithInclude:null,
    },
  }

  const initialState:UpdateState = {
    rentalRequestList: [] ,
    rentalItemList: [],
    itemWithInclude:null,
    status: {
      rentalRequestList: 'idle',
      rentalItemList: 'idle',
      itemWithInclude:'idle',
    },
    error: {
      rentalRequestList: null,
      rentalItemList: null,
      itemWithInclude:null,
    },
  }
export const updateTriggerSlice = createSlice({
  name: 'updateTrigger',
  initialState  ,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handling fetchRentedItemsByRoleId
      .addCase(fetchRentedItemsByRoleId.pending, (state) => {
        state.status.rentalRequestList = 'loading';
      })
      .addCase(fetchRentedItemsByRoleId.fulfilled, (state, action) => {
        state.status.rentalRequestList = 'succeeded';
        state.rentalRequestList = action.payload;
      })
      .addCase(fetchRentedItemsByRoleId.rejected, (state, action) => {
        state.status.rentalRequestList = 'failed';
      })
      // Handling rentalItemList
      .addCase(fetchItemsByRoleId.pending, (state) => {
        state.status.rentalItemList = 'loading';
      })
      .addCase(fetchItemsByRoleId.fulfilled, (state, action) => {
        state.status.rentalItemList = 'succeeded';
        state.rentalItemList = action.payload;
      })
      .addCase(fetchItemsByRoleId.rejected, (state, action) => {
        state.status.rentalItemList = 'failed';
      })

      // Handling fetchItemByIdWithInclude
      .addCase(fetchItemByIdWithInclude.pending, (state) => {
        state.status.itemWithInclude = 'loading';
      })
      .addCase(fetchItemByIdWithInclude.fulfilled, (state, action) => {
        state.status.itemWithInclude = 'succeeded';
        state.itemWithInclude = action.payload;
      })
      .addCase(fetchItemByIdWithInclude.rejected, (state, action) => {
        state.status.itemWithInclude = 'failed';
      });
  },
});

export default updateTriggerSlice.reducer;
