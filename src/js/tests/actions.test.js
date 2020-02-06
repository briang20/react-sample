import configureStore from 'redux-mock-store';
import {
    addContact,
    removeContact,
    modifyContact,
    changeSorting,
    changeSearchFilter,
    addSelectedItem,
    removeSelectedItem
} from "../actions/index";
import {
    ADD_CONTACT,
    REMOVE_CONTACT,
    MODIFY_CONTACT,
    CHANGE_SORTING,
    CHANGE_SEARCH_FILTER,
    ADD_SELECTED_ITEM, REMOVE_SELECTED_ITEM
} from "../constants/action-types";

const middleware = [];
const mockStore = configureStore(middleware);

it('should dispatch an add contact action', function () {
    // Initialize mockstore with empty state
    const initialState = {};
    const store = mockStore(initialState);
    const opts = {'name': 'test'};
    store.dispatch(addContact(opts));

    const actions = store.getActions();
    const expectedPayload = {type: ADD_CONTACT, payload: opts};
    expect(actions).toEqual([expectedPayload])
});

it('should dispatch an remove contact action', function () {
    // Initialize mockstore with empty state
    const initialState = {};
    const store = mockStore(initialState);
    const opts = {'name': 'test'};
    store.dispatch(removeContact(opts));

    const actions = store.getActions();
    const expectedPayload = {type: REMOVE_CONTACT, payload: opts};
    expect(actions).toEqual([expectedPayload])
});

it('should dispatch an modify contact action', function () {
    // Initialize mockstore with empty state
    const initialState = {};
    const store = mockStore(initialState);
    const opts = {'name': 'test'};
    store.dispatch(modifyContact(opts, opts));

    const actions = store.getActions();
    const expectedPayload = {type: MODIFY_CONTACT, oldPayload: opts, payload: opts};
    expect(actions).toEqual([expectedPayload])
});

it('should dispatch an changeSorting action', function () {
    // Initialize mockstore with empty state
    const initialState = {};
    const store = mockStore(initialState);
    const opts = {'name': 'test'};
    store.dispatch(changeSorting(opts));

    const actions = store.getActions();
    const expectedPayload = {type: CHANGE_SORTING, payload: opts};
    expect(actions).toEqual([expectedPayload])
});

it('should dispatch an changeSearchFilter action', function () {
    // Initialize mockstore with empty state
    const initialState = {};
    const store = mockStore(initialState);
    const opts = {'name': 'test'};
    store.dispatch(changeSearchFilter(opts));

    const actions = store.getActions();
    const expectedPayload = {type: CHANGE_SEARCH_FILTER, payload: opts};
    expect(actions).toEqual([expectedPayload])
});

it('should dispatch an addSelected action', function () {
    // Initialize mockstore with empty state
    const initialState = {};
    const store = mockStore(initialState);
    const opts = {'name': 'test'};
    store.dispatch(addSelectedItem(opts));

    const actions = store.getActions();
    const expectedPayload = {type: ADD_SELECTED_ITEM, payload: opts};
    expect(actions).toEqual([expectedPayload])
});

it('should dispatch an removeSelected action', function () {
    // Initialize mockstore with empty state
    const initialState = {};
    const store = mockStore(initialState);
    const opts = {'name': 'test'};
    store.dispatch(removeSelectedItem(opts));

    const actions = store.getActions();
    const expectedPayload = {type: REMOVE_SELECTED_ITEM, payload: opts};
    expect(actions).toEqual([expectedPayload])
});