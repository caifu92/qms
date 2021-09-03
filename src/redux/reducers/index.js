import { RESET_SHOP, UPDATE_SHOP } from '../actions/actionTypes'

const initialState = null;

export default function(state = initialState, action) {
    switch (action.type) {
        case UPDATE_SHOP: 
            return {
                ...state,
                ...action.payload
            };
            break;
        case RESET_SHOP:
            return null;
            break;
    }
}
