// src/actions/index.js

import {CALL_API} from "redux-callapi-middleware";
import {
    ADD_CONTACT,
    REMOVE_CONTACT,
    MODIFY_CONTACT,
    UPDATE_CONTACTS,
    CLEAR_CONTACTS,
    USER_API_REQUEST,
    USER_API_SUCCESS,
    USER_API_FAILURE
} from "../constants/action-types";

export function updateUsers(payload) {
    return {type: UPDATE_CONTACTS, payload}
}

export function addUser(payload) {
    return {type: ADD_CONTACT, payload}
}

export function removeUser(payload) {
    return {type: REMOVE_CONTACT, payload}
}

export function modifyUser(payload) {
    return {type: MODIFY_CONTACT, payload}
}

export function clearUsers() {
    return {type: CLEAR_CONTACTS}
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
        });
    };
}

export function getUsers() {
    return (dispatch, getState, api) => {
        return dispatch(fetchUsers('get'))
            .then(async res => {
                if (res.type === USER_API_SUCCESS) {
                    const data = await res.payload.json();
                    dispatch(clearUsers());
                    dispatch(updateUsers(data));
                    return {...res, data: data};
                }
                return {...res, data: null};
            })
    };
}

export function postUsers(opts) {
    return (dispatch, getState, api) => {
        return dispatch(fetchUsers('post', JSON.stringify(opts), opts.id))
            .then(async res => {
                if (res.type === USER_API_SUCCESS) {
                    const data = await res.payload.json();
                    dispatch(updateUsers(data));
                    return {...res, data: data};
                }
                return {...res, data: null};
            });
    };
}

export function putUsers(opts) {
    return (dispatch, getState, api) => {
        return dispatch(fetchUsers('put', JSON.stringify(opts), opts.id))
            .then(async res => {
                if (res.type === USER_API_SUCCESS) {
                    const data = await res.payload.json();
                    dispatch(modifyUser(data));
                    return {...res, data: data};
                }
                return {...res, data: null};
            });
    };
}

export function deleteUsers(opts) {
    return (dispatch, getState, api) => {
        return dispatch(fetchUsers('delete', null, opts.id))
            .then(async res => {
                if (res.type === USER_API_SUCCESS) {
                    await dispatch(removeUser(opts));
                }
                return {...res, data: null};
            });
    };
}