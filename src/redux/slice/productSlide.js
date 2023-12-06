import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  search: '',
  allProducts: [], // Include allProducts in your initial state
  filteredProducts: [],
}

export const productSlide = createSlice({
  name: 'product',
  initialState,
  reducers: {
    searchProduct: (state, action) => {
      state.search = action.payload;

      // Filter the products based on the search term
      state.filteredProducts = state.allProducts.filter(product =>
        product?.name.toLowerCase().includes(action.payload.toLowerCase())

      );
    },
  },
})

// Action creators are generated for each case reducer function
export const { searchProduct } = productSlide.actions

export default productSlide.reducer