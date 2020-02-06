// src/js/reducers/index.js

import {
    ADD_CONTACT,
    REMOVE_CONTACT,
    MODIFY_CONTACT,
    CHANGE_SORTING,
    CHANGE_SEARCH_FILTER,
    ADD_SELECTED_ITEM, REMOVE_SELECTED_ITEM
} from "../constants/action-types";

export const initialState = {
    contacts: [],
    currentSortMethod: 'default',
    currentSearchFilter: '',
    currentSelectedItems: []
};

function rootReducer(state = initialState, action) {
    if (action.type === ADD_CONTACT) {
        return Object.assign({}, state, {
            contacts: state.contacts.concat(action.payload)
        });
    }
    if (action.type === REMOVE_CONTACT) {
        console.log(action.payload);
        return Object.assign({}, state, {
            contacts: state.contacts.filter(contact => contact !== action.payload)
        });
    }
    if (action.type === MODIFY_CONTACT) {
        return Object.assign({}, state, {
            contacts: state.contacts.map(obj => {
                if (obj === action.oldPayload)
                    return action.payload;
                return obj;
            })
        });
    }
    if (action.type === CHANGE_SORTING) {
        return Object.assign({}, state, {
            currentSortMethod: action.payload
        });
    }
    if (action.type === CHANGE_SEARCH_FILTER) {
        return Object.assign({}, state, {
            currentSearchFilter: action.payload
        });
    }
    if (action.type === ADD_SELECTED_ITEM) {
        return Object.assign({}, state, {
            currentSelectedItems: state.currentSelectedItems.concat(action.payload)
        });
    }
    if (action.type === REMOVE_SELECTED_ITEM) {
        return Object.assign({}, state, {
            currentSelectedItems: state.currentSelectedItems.filter(item => item !== action.payload)
        });
    }

    return state;
}

export default rootReducer;