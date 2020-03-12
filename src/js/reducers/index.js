// src/js/reducers/index.js
import {combineReducers} from "redux";
import contacts from "./contacts";
import groups from "./groups";

export default combineReducers({
    groups,
    contacts
});