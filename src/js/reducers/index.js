// src/js/reducers/index.js

import {
    CHANGE_SORTING,
    CHANGE_SEARCH_FILTER, UPDATE_USER_GROUPS, CLEAR_USER_GROUPS,
} from "../constants/action-types";
import {combineReducers} from "redux";
import contacts from "./contacts";

export function sorter(state = {currentSortMethod: 'default', currentSearchFilter: ''}, action) {
    switch (action.type) {
        case CHANGE_SORTING:
            return Object.assign({}, state, {
                currentSortMethod: action.payload
            });
        case CHANGE_SEARCH_FILTER:
            return Object.assign({}, state, {
                currentSearchFilter: action.payload
            });
        default:
            return state;
    }
}

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
    sorter,
    groups,
    contacts
});