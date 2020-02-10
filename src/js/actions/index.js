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

export function fetchContacts(type, opts, fnCallback, key) {
    return (dispatch, getState, api) => {
        let url = api ? api : 'https://my-json-server.typicode.com/RavenX8/react-sample/users';
        if (type !== 'get' && type !== 'post') url = url + "/" + key;
        return fetch(url, {
            method: type,
            headers: {'Content-Type': 'application/json'},
            body: opts
        })
            .then(res => res.json(),
                error => console.log('An error occurred.', error))
            .then(data => fnCallback(data))
    };
}

export function getContacts() {
    return (dispatch, getState, api) => {
        dispatch(fetchContacts('get', null, function (data) {
            dispatch(clearContacts());
            for (let contact of data) {
                contact.selected = false;
                dispatch(addContact(contact));
            }
        }));
    }
}

export function postContacts(opts) {
    return (dispatch, getState, api) => {
        dispatch(fetchContacts('post', JSON.stringify(opts), data => dispatch(getContacts()), opts.id));
    }
}

export function modifyContacts(opts) {
    return (dispatch, getState, api) => {
        dispatch(fetchContacts('put', JSON.stringify(opts), data => dispatch(getContacts()), opts.id));
    }
}

export function deleteContacts(opts) {
    return (dispatch, getState, api) => {
        dispatch(fetchContacts('delete', JSON.stringify(opts), data => dispatch(getContacts()), opts.id));
    }
}