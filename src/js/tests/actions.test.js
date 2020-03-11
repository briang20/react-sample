import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'
import {
    addUser,
    removeUser,
    modifyUser,
    clearUsers, updateUsers
} from "../actions/index";
import {
    ADD_CONTACT,
    REMOVE_CONTACT,
    MODIFY_CONTACT,
    CLEAR_CONTACTS, MODIFY_USER_GROUPS, REMOVE_USER_GROUPS, CLEAR_USER_GROUPS, UPDATE_USER_GROUPS, UPDATE_CONTACTS
} from "../constants/action-types";
import {createMiddleware} from "redux-callapi-middleware";
import {clearUserGroups, modifyUserGroups, removeUserGroups, updateUserGroups} from "../actions/group-actions";


const onSuccess = (response) => {
    if (!response.ok) throw new Error('Error');
    return response;
};
const callApi = (url, options) => fetch(url, options).then(onSuccess);
const apiMiddleware = createMiddleware({callApi});

const api = require('../../.settings.json').main.apiUrl;
const middleware = [thunk.withExtraArgument(api), apiMiddleware];
const mockStore = configureStore(middleware);

it('should dispatch an update contact action', function () {
    // Initialize mockstore with empty state
    const initialState = {};
    const store = mockStore(initialState);
    const opts = {'name': 'test'};
    store.dispatch(updateUsers(opts));

    const actions = store.getActions();
    const expectedPayload = {type: UPDATE_CONTACTS, payload: opts};
    expect(actions).toEqual([expectedPayload])
});

it('should dispatch an remove contact action', function () {
    // Initialize mockstore with empty state
    const initialState = {};
    const store = mockStore(initialState);
    const opts = {'name': 'test'};
    store.dispatch(removeUser(opts));

    const actions = store.getActions();
    const expectedPayload = {type: REMOVE_CONTACT, payload: opts};
    expect(actions).toEqual([expectedPayload])
});

it('should dispatch an modify contact action', function () {
    // Initialize mockstore with empty state
    const initialState = {};
    const store = mockStore(initialState);
    const opts = {'name': 'test'};
    store.dispatch(modifyUser(opts));

    const actions = store.getActions();
    const expectedPayload = {type: MODIFY_CONTACT, payload: opts};
    expect(actions).toEqual([expectedPayload])
});

it('should dispatch an CLEAR_CONTACTS action', function () {
    // Initialize mockstore with empty state
    const initialState = {};
    const store = mockStore(initialState);
    store.dispatch(clearUsers());

    const actions = store.getActions();
    const expectedPayload = {type: CLEAR_CONTACTS};
    expect(actions).toEqual([expectedPayload])
});


it('should dispatch an UPDATE_USER_GROUPS action', function () {
    // Initialize mockstore with empty state
    const initialState = {};
    const store = mockStore(initialState);
    store.dispatch(updateUserGroups());

    const actions = store.getActions();
    const expectedPayload = {type: UPDATE_USER_GROUPS};
    expect(actions).toEqual([expectedPayload])
});

it('should dispatch an MODIFY_USER_GROUPS action', function () {
    // Initialize mockstore with empty state
    const initialState = {};
    const store = mockStore(initialState);
    store.dispatch(modifyUserGroups());

    const actions = store.getActions();
    const expectedPayload = {type: MODIFY_USER_GROUPS};
    expect(actions).toEqual([expectedPayload])
});

it('should dispatch an REMOVE_USER_GROUPS action', function () {
    // Initialize mockstore with empty state
    const initialState = {};
    const store = mockStore(initialState);
    store.dispatch(removeUserGroups());

    const actions = store.getActions();
    const expectedPayload = {type: REMOVE_USER_GROUPS};
    expect(actions).toEqual([expectedPayload])
});

it('should dispatch an CLEAR_USER_GROUPS action', function () {
    // Initialize mockstore with empty state
    const initialState = {};
    const store = mockStore(initialState);
    store.dispatch(clearUserGroups());

    const actions = store.getActions();
    const expectedPayload = {type: CLEAR_USER_GROUPS};
    expect(actions).toEqual([expectedPayload])
});