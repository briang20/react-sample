// src/js/reducers/index.js

import { ADD_CONTACT } from "../constants/action-types";

const initialState = {
    contacts: []
};

function rootReducer(state = initialState, action) {
    if (action.type === ADD_CONTACT) {
        return Object.assign({}, state, {
            contacts: state.contacts.concat(action.payload)
        });
    }
    return state;
};

export default rootReducer;