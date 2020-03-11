import configureStore from 'redux-mock-store';
import thunk from "redux-thunk";
import * as userActions from "../actions/index"
import * as groupActions from "../actions/group-actions"
import * as types from "../constants/action-types"
import {createMiddleware} from "redux-callapi-middleware";
import {CALL_API_PHASE} from "redux-callapi-middleware";

const onSuccess = (response) => {
    if (!response.ok) throw new Error('Error');
    return response;
};
const callApi = (url, options) => fetch(url, options).then(onSuccess);
const apiMiddleware = createMiddleware({callApi});

const api = 'http://local';
const initialState = {
    contacts: {contacts: []},
    groups: {groups: []}
};

const middleware = [thunk.withExtraArgument(api), apiMiddleware];
const mockStore = configureStore(middleware);

describe('testing api calls', () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    it('should be able to update users', function () {
        fetch.mockResponses(
            // Initial api call
            [
                JSON.stringify([]),
                {status: 200}
            ]
        );
        const expectedActions = [
            {type: types.USER_API_REQUEST, [CALL_API_PHASE]: "REQUEST"},
            {type: types.USER_API_SUCCESS, [CALL_API_PHASE]: "SUCCESS", payload: new Response()},
            {type: types.CLEAR_CONTACTS},
            {type: types.UPDATE_CONTACTS, payload: []}
        ];
        const store = mockStore({});

        return store.dispatch(userActions.getUsers()).then(() => {
            // return of async actions
            expect(store.getActions()).toEqual(expectedActions)
        })
    });

    it('should be able to delete users', function () {
        fetch.mockResponses(
            // Initial api call
            [
                JSON.stringify([]),
                {status: 200}
            ]
        );
        const expectedActions = [
            {type: types.USER_API_REQUEST, [CALL_API_PHASE]: "REQUEST"},
            {type: types.USER_API_SUCCESS, [CALL_API_PHASE]: "SUCCESS", payload: new Response({id: 1})},
            {type: types.REMOVE_CONTACT, payload: {id: 1}}
        ];
        const store = mockStore({});

        return store.dispatch(userActions.deleteUsers({id: 1})).then(() => {
            // return of async actions
            expect(store.getActions()).toEqual(expectedActions)
        })
    });

    it('should be able to update groups', function () {
        fetch.mockResponses(
            // Initial api call
            [
                JSON.stringify([]),
                {status: 200}
            ]
        );
        const expectedActions = [
            {type: types.GROUPS_API_REQUEST, [CALL_API_PHASE]: "REQUEST"},
            {type: types.GROUPS_API_SUCCESS, [CALL_API_PHASE]: "SUCCESS", payload: new Response()},
            {type: types.CLEAR_USER_GROUPS},
            {type: types.UPDATE_USER_GROUPS, payload: []}
        ];
        const store = mockStore({});

        return store.dispatch(groupActions.getGroups()).then(() => {
            // return of async actions
            expect(store.getActions()).toEqual(expectedActions)
        })
    });
});