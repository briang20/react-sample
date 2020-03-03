// src/js/reducers/index.js

import {
    UPDATE_USER_GROUPS,
    CLEAR_USER_GROUPS,
} from "../constants/action-types";
import {combineReducers} from "redux";
import contacts from "./contacts";

export function groups(state = {groups: []}, action) {
    switch (action.type) {
        case UPDATE_USER_GROUPS:
            return Object.assign({}, state, {
                groups: state.groups.concat(action.payload)
            });
        case CLEAR_USER_GROUPS:
            return Object.assign({}, state, {
                groups: []
            });
        default:
            return state;
    }
}

export default combineReducers({
    groups,
    contacts
});