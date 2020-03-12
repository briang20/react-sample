import thunk from 'redux-thunk'
import {
    removeUser,
    modifyUser,
    clearUsers,
    updateUsers
} from "../actions/index";
import {createMiddleware} from "redux-callapi-middleware";
import {clearUserGroups, modifyUserGroups, removeUserGroups, updateUserGroups} from "../actions/group-actions";
import {applyMiddleware, createStore} from "redux";
import reducer from "../reducers";

const onSuccess = (response) => {
    if (!response.ok) throw new Error('Error');
    return response;
};
const callApi = (url, options) => fetch(url, options).then(onSuccess);
const apiMiddleware = createMiddleware({callApi});

const api = require('../../.settings.json').main.apiUrl;
const middleware = [thunk.withExtraArgument(api), apiMiddleware];

function configureStore(initialState) {
    return createStore(reducer,
        initialState,
        applyMiddleware(...middleware)
    );
}

it('should add a user', function () {
    const initialState = {};
    const store = configureStore(initialState);
    const opts = {'name': 'test'};
    store.dispatch(updateUsers(opts));

    const state = store.getState();
    const expectedPayload = [{name: 'test'}];
    expect(state.contacts.contacts).toEqual(expectedPayload)
});

it('should remove a user', function () {
    const opts = {'id': 1, 'name': 'test'};
    const initialState = {contacts: {contacts: [opts]}};
    const store = configureStore(initialState);
    store.dispatch(removeUser(opts));

    const state = store.getState();
    const expectedPayload = [];
    expect(state.contacts.contacts).toEqual(expectedPayload)
});

it('should modify a user', function () {
    const initialState = {contacts: {contacts: [{'id': 1, 'name': 'test'}]}};
    const store = configureStore(initialState);
    const opts = {'id': 1, 'name': 'test1'};
    store.dispatch(modifyUser(opts));

    const state = store.getState();
    const expectedPayload = [{'id': 1, 'name': 'test1'}];
    expect(state.contacts.contacts).toEqual(expectedPayload)
});

it('should clear the user store', function () {
    const initialState = {contacts: {contacts: [{'id': 1, 'name': 'test'}]}};
    const store = configureStore(initialState);
    store.dispatch(clearUsers());

    const state = store.getState();
    const expectedPayload = [];
    expect(state.contacts.contacts).toEqual(expectedPayload)
});


it('should add a group', function () {
    const initialState = {};
    const store = configureStore(initialState);
    const opts = {'id': 1, 'name': 'test'};
    store.dispatch(updateUserGroups(opts));

    const state = store.getState();
    const expectedPayload = [{'id': 1, 'name': 'test'}];
    expect(state.groups.groups).toEqual(expectedPayload)
});

it('should modify a group', function () {
    const initialState = {groups: {groups: [{'id': 1, 'name': 'test'}]}};
    const store = configureStore(initialState);
    const opts = {'id': 1, 'name': 'test1'};
    store.dispatch(modifyUserGroups(opts));

    const state = store.getState();
    const expectedPayload = [{'id': 1, 'name': 'test1'}];
    expect(state.groups.groups).toEqual(expectedPayload)
});

it('should remove a group', function () {
    const opts = {'id': 1, 'name': 'test'};
    const initialState = {groups: {groups: [opts]}};
    const store = configureStore(initialState);
    store.dispatch(removeUserGroups(opts));

    const state = store.getState();
    const expectedPayload = [];
    expect(state.groups.groups).toEqual(expectedPayload)
});

it('should clear the groups store', function () {
    const initialState = {groups: {groups: [{'id': 1, 'name': 'test'}]}};
    const store = configureStore(initialState);
    store.dispatch(clearUserGroups());

    const state = store.getState();
    const expectedPayload = [];
    expect(state.groups.groups).toEqual(expectedPayload)
});