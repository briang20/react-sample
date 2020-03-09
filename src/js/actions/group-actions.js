import {CALL_API} from "redux-callapi-middleware";
import {
    CLEAR_USER_GROUPS,
    GROUPS_API_FAILURE,
    GROUPS_API_REQUEST,
    GROUPS_API_SUCCESS,
    MODIFY_USER_GROUPS,
    REMOVE_USER_GROUPS,
    UPDATE_USER_GROUPS
} from "../constants/action-types";

export function updateUserGroups(payload) {
    return {type: UPDATE_USER_GROUPS, payload}
}

export function modifyUserGroups(payload) {
    return {type: MODIFY_USER_GROUPS, payload}
}

export function removeUserGroups(payload) {
    return {type: REMOVE_USER_GROUPS, payload}
}

export function clearUserGroups() {
    return {type: CLEAR_USER_GROUPS}
}


export function fetchGroups(type, opts = null, key = '') {
    return (dispatch, getState, api) => {
        let url = api ? api + '/groups' : 'https://my-json-server.typicode.com/RavenX8/react-sample/groups';
        if (type !== 'get' && type !== 'post') url = url + "/" + key;

        return dispatch({
            [CALL_API]: {
                types: [GROUPS_API_REQUEST, GROUPS_API_SUCCESS, GROUPS_API_FAILURE],
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

export function getGroups() {
    return (dispatch, getState, api) => {
        return dispatch(fetchGroups('get'))
            .then(async res => {
                if (res.type === GROUPS_API_SUCCESS) {
                    const data = await res.payload.json();
                    dispatch(clearUserGroups());
                    dispatch(updateUserGroups(data));
                    return {...res, data: data};
                }
                return {...res, data: null};
            });
    };
}

export function postGroups(opts) {
    return (dispatch, getState, api) => {
        return dispatch(fetchGroups('post', JSON.stringify(opts), opts.value))
            .then(async res => {
                if (res.type === GROUPS_API_SUCCESS) {
                    const data = await res.payload.json();
                    dispatch(updateUserGroups(data));
                    return {...res, data: data};
                }
                return {...res, data: null};
            });
    };
}

export function putGroups(opts) {
    return (dispatch, getState, api) => {
        return dispatch(fetchGroups('put', JSON.stringify(opts), opts.value))
            .then(async res => {
                if (res.type === GROUPS_API_SUCCESS) {
                    const data = await res.payload.json();
                    dispatch(modifyUserGroups(data));
                    return {...res, data: data};
                }
                return {...res, data: null};
            });
    };
}

export function deleteGroups(opts) {
    return (dispatch, getState, api) => {
        return dispatch(fetchGroups('delete', null, opts.value))
            .then(async res => {
                if (res.type === GROUPS_API_SUCCESS) {
                    const data = await res.payload.json();
                    dispatch(removeUserGroups(data));
                }
                return {...res, data: null};
            });
    };
}
