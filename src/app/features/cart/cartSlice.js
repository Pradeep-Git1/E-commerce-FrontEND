// src/app/features/cart/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRequest, postRequest } from '../../../Services/api';
import { message } from 'antd';

// Helper functions for anonymous cart
const getAnonymousCart = () => {
    const cart = localStorage.getItem('anonymousCart');
    return cart ? JSON.parse(cart) : [];
};

const saveAnonymousCart = (cart) => {
    localStorage.setItem('anonymousCart', JSON.stringify(cart));
};

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { getState, rejectWithValue }) => {
    const user = getState().user.data;
    if (user) {
        try {
            const cartData = await getRequest('/cart/');
            return cartData;
        } catch (err) {
            return rejectWithValue('Failed to load cart data.');
        }
    } else {
        return { cart: [] }; // Return empty cart if not logged in
    }
});

export const addToCart = createAsyncThunk('cart/addToCart', async (product, { getState, dispatch, rejectWithValue }) => {
    const user = getState().user.data;
    if (user) {
        try {
            await postRequest('/cart/add/', { product_id: product.id, quantity: 1 });
            message.success('Product added to cart');
            dispatch(fetchCart());
            return;
        } catch (err) {
            message.error('Failed to add to cart.');
            return rejectWithValue('Failed to add to cart.');
        }
    } else {
        const anonymousCart = getAnonymousCart();
        const newAnonymousCart = [...anonymousCart, { ...product, quantity: 1 }];
        saveAnonymousCart(newAnonymousCart);
        return newAnonymousCart;
    }
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (itemId, { getState, dispatch, rejectWithValue }) => {
    const user = getState().user.data;
    if (user) {
        try {
            await postRequest('/cart/remove/', { item_id: itemId });
            message.success('Product removed from cart');
            dispatch(fetchCart());
            return;
        } catch (err) {
            message.error('Failed to remove from cart.');
            return rejectWithValue('Failed to remove from cart.');
        }
    } else {
        let anonymousCart = getAnonymousCart();
        anonymousCart = anonymousCart.filter((item, index) => index !== itemId);
        saveAnonymousCart(anonymousCart);
        return anonymousCart;
    }
});

export const mergeCarts = createAsyncThunk('cart/mergeCarts', async (_, { getState, dispatch, rejectWithValue }) => {
    const user = getState().user.data;
    const anonymousCart = getAnonymousCart();

    if (user && anonymousCart.length > 0) {
        try {
            for (const item of anonymousCart) {
                await postRequest('/cart/add/', { product_id: item.id, quantity: item.quantity });
            }
            localStorage.removeItem('anonymousCart');
            dispatch(fetchCart());
            return;
        } catch (err) {
            return rejectWithValue('Failed to merge carts.');
        }
    }
    return;
});

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        anonymousItems: getAnonymousCart(),
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload.cart.map((item, index) => ({
                    id: index + 1,
                    name: item.product_name,
                    quantity: item.quantity,
                    price: item.subtotal / item.quantity,
                    image: '/default-product-image.jpg',
                }));
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                if (!state.user) {
                    state.anonymousItems = action.payload;
                }
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                if (!state.user) {
                    state.anonymousItems = action.payload;
                }
            })
            .addCase(fetchCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default cartSlice.reducer;