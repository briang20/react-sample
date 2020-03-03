// src/actions/index.js

import {CALL_API} from "redux-callapi-middleware";
import {
    ADD_CONTACT,
    REMOVE_CONTACT,
    MODIFY_CONTACT,
    UPDATE_CONTACTS,
    CLEAR_CONTACTS,
    CLEAR_USER_GROUPS,
    UPDATE_USER_GROUPS,
    USER_API_REQUEST,
    USER_API_SUCCESS,
    USER_API_FAILURE,
    GROUPS_API_REQUEST,
    GROUPS_API_SUCCESS,
    GROUPS_API_FAILURE
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

export function modifyContact(payload) {
    return {type: MODIFY_CONTACT, payload}
}
export function clearContacts() {
    return {type: CLEAR_CONTACTS}
}

export function updateUserGroups(payload) {
    return {type: UPDATE_USER_GROUPS, payload}
}

export function clearUserGroups() {
    return {type: CLEAR_USER_GROUPS}
}

export function fetchUsers(type, opts = null, key = '') {
    return (dispatch, getState, api) => {
        let url = api ? api + '/users' : 'https://my-json-server.typicode.com/RavenX8/react-sample/users';
        if (type !== 'get' && type !== 'post') url = url + "/" + key;

        return dispatch({
            [CALL_API]: {
                types: [USER_API_REQUEST, USER_API_SUCCESS, USER_API_FAILURE],
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

export function getUserGroups() {
    return (dispatch, getState, api) => {
        let url = api ? api + '/groups' : 'https://my-json-server.typicode.com/RavenX8/react-sample/groups';
        return dispatch({
            [CALL_API]: {
                types: [GROUPS_API_REQUEST, GROUPS_API_SUCCESS, GROUPS_API_FAILURE],
                endpoint: url,
                options: {
                    method: 'get',
                    headers: {'Content-Type': 'application/json'},
                }
            }
        })
            .then(async res => {
                if (res.type === GROUPS_API_SUCCESS) {
                    const data = await res.payload.json();
                    dispatch(clearUserGroups());
                    dispatch(updateUserGroups(data));
                    return {...res, data: data};
                }
                return {...res, data: null};
            })
    }
}

export function getContacts() {
    return (dispatch, getState, api) => {
        return dispatch(fetchUsers('get'))
            .then(async res => {
                if (res.type === USER_API_SUCCESS) {
                    const data = await res.payload.json();
                    dispatch(clearContacts());
                    dispatch(updateContacts(data));
                    return {...res, data: data};
                }
                return {...res, data: null};
            })
    }
}

export function postContacts(opts) {
    return (dispatch, getState, api) => {
        return dispatch(fetchUsers('post', JSON.stringify(opts), opts.id))
            .then(async res => {
                if (res.type === USER_API_SUCCESS) {
                    const data = await res.payload.json();
                    dispatch(updateContacts(data));
                    return {...res, data: data};
                }
                return {...res, data: null};
            });
    }
}

export function putContacts(opts) {
    return (dispatch, getState, api) => {
        return dispatch(fetchUsers('put', JSON.stringify(opts), opts.id))
            .then(async res => {
                if (res.type === USER_API_SUCCESS) {
                    const data = await res.payload.json();
                    dispatch(modifyContact(data));
                    return {...res, data: data};
                }
                return {...res, data: null};
            });
    }
}

export function deleteContacts(opts) {
    return (dispatch, getState, api) => {
        return dispatch(fetchUsers('delete', null, opts.id))
            .then(async res => {
                if (res.type === USER_API_SUCCESS) {
                    await dispatch(removeContact(opts));
                }
                return {...res, data: null};
            });
    }
}