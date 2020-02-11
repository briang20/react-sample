// src/js/reducers/index.js

import {
    CHANGE_SORTING,
    CHANGE_SEARCH_FILTER,
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

export default combineReducers({
    sorter,
    contacts
});