// src/actions/index.js

import {
    ADD_CONTACT,
    REMOVE_CONTACT,
    MODIFY_CONTACT,
    CHANGE_SORTING,
    CHANGE_SEARCH_FILTER,
    ADD_SELECTED_ITEM,
    REMOVE_SELECTED_ITEM,
    CLEAR_SELECTED_ITEMS,
    CLEAR_CONTACTS
} from "../constants/action-types";

export function addContact(payload) {
    return {type: ADD_CONTACT, payload}
}

export function removeContact(payload) {
    return {type: REMOVE_CONTACT, payload}
}

export function modifyContact(oldPayload, payload) {
    return {type: MODIFY_CONTACT, oldPayload, payload}
}

export function changeSorting(payload) {
    return {type: CHANGE_SORTING, payload}
}

export function changeSearchFilter(payload) {
    return {type: CHANGE_SEARCH_FILTER, payload}
}

export function addSelectedItem(payload) {
    return {type: ADD_SELECTED_ITEM, payload}
}

export function removeSelectedItem(payload) {
    return {type: REMOVE_SELECTED_ITEM, payload}
}

export function clearSelectedItems() {
    return {type: CLEAR_SELECTED_ITEMS}
}

export function clearContacts() {
    return {type: CLEAR_CONTACTS}
}

// export function fetchContacts(type, opts, fnCallback) {
//     return function (dispatch) {
//         const config = require('../../.settings.json');
//         return fetch(config.main.apiUrl ? config.main.apiUrl : 'http://jsonplaceholder.typicode.com/users', {
//             method: type,
//             headers: {'Content-Type': 'application/json'},
//             body: opts
//         })
//             .then(res => res.json(),
//                 error => console.log('An error occurred.', error))
//             .then(data =>
//                 dispatch(fnCallback(data))
//             )
//     }
// }