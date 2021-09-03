import { RESET_SHOP, UPDATE_SHOP } from './actionTypes'

export const updateShop = (data) => ({
    type: UPDATE_SHOP,
    payload: data
});

export const resetShop = (data) => ({
    type: RESET_SHOP
});
