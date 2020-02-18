// src/actions/index.js

import {CALL_API} from "redux-callapi-middleware";
import {
    ADD_CONTACT,
    REMOVE_CONTACT,
    MODIFY_CONTACT,
    UPDATE_CONTACTS,
    CHANGE_SORTING,
    CHANGE_SEARCH_FILTER,
    ADD_SELECTED_ITEM,
    REMOVE_SELECTED_ITEM,
    CLEAR_SELECTED_ITEMS,
    CLEAR_CONTACTS, CLEAR_REPLAY
} from "../constants/action-types";

export function updateContacts(payload) {
    return {type: UPDATE_CONTACTS, payload}
}

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

export function clearReplayBuffer() {
    return {type: CLEAR_REPLAY}
}

export function fetchContacts(type, opts = null, key = '') {
    return (dispatch, getState, api) => {
        let url = api ? api : 'https://my-json-server.typicode.com/RavenX8/react-sample/users';
        if (type !== 'get' && type !== 'post') url = url + "/" + key;

        return dispatch({
            [CALL_API]: {
                types: ['REQUEST', 'SUCCESS', 'FAILURE'],
                endpoint: url,
                options: {
                    method: type,
                    headers: {'Content-Type': 'application/json'},
                    body: opts
                }
            }
        })
    };
}

export function getContacts() {
    return (dispatch, getState, api) => {
        return dispatch(fetchContacts('get'))
            .then(async res => {
                if (res.type === 'SUCCESS') {
                    const data = await res.payload.json();
                    dispatch(clearContacts());
                    dispatch(updateContacts(data));
                }
            })
    }
}

export function postContacts(opts) {
    return (dispatch, getState, api) => {
        dispatch(fetchContacts('post', JSON.stringify(opts), opts.id));
    }
}

export function modifyContacts(opts) {
    return (dispatch, getState, api) => {
        dispatch(fetchContacts('put', JSON.stringify(opts), opts.id));
    }
}

export function deleteContacts(opts) {
    return (dispatch, getState, api) => {
        dispatch(fetchContacts('delete', JSON.stringify(opts), opts.id));
    }
}