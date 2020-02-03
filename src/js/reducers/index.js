// src/js/reducers/index.js

import {ADD_CONTACT, REMOVE_CONTACT, MODIFY_CONTACT, CHANGE_SORTING} from "../constants/action-types";

const initialState = {
    contacts: [],
    currentSortMethod: 'default'
};

function rootReducer(state = initialState, action) {
    if (action.type === ADD_CONTACT) {
        return Object.assign({}, state, {
            contacts: state.contacts.concat(action.payload)
        });
    }
    if (action.type === REMOVE_CONTACT) {
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

    return state;
}

export default rootReducer;