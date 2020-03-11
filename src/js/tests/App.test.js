import React from "react";
import configureStore from 'redux-mock-store';
import {applyMiddleware, createStore} from 'redux'
import {Provider} from 'react-redux'
import {render, fireEvent} from '@testing-library/react'
import reducer from '../reducers/index'
import App from '../App';
import thunk from "redux-thunk";
import {createMiddleware} from "redux-callapi-middleware";
import {BrowserRouter as Router} from "react-router-dom";

const onSuccess = (response) => {
    if (!response.ok) {
        throw new Error('Error');
    }
    return response;
};

//const fetchMock = require('fetch-mock/es5/client');
const callApi = (url, options) => fetch(url, options).then(onSuccess);
const apiMiddleware = createMiddleware({callApi});

const api = 'http://local';
const initialState = {
    contacts: {contacts: []},
    groups: {groups: []}
};

const middleware = [thunk.withExtraArgument(api), apiMiddleware];
const mockStore = configureStore(middleware);

function renderWithRedux(
    ui,
    {initialState, store = mockStore(initialState)} = {}
) {
    return {
        ...render(<Router><Provider store={store}>{ui}</Provider></Router>),
        // adding `store` to the returned utilities to allow us
        // to reference it in our tests (just try to avoid using
        // this to test implementation details).
        store,
    }
};

describe('testing ui', () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    it('should render columns correctly', function () {
        fetch.mockResponse(JSON.stringify([]));
        const {getByText} = renderWithRedux(<App/>);

        expect(getByText('#')).toBeInTheDocument();
        expect(getByText('Name')).toBeInTheDocument();
        expect(getByText('Username')).toBeInTheDocument();
        expect(getByText('Email')).toBeInTheDocument();
        expect(getByText('URL')).toBeInTheDocument();
    });

    it('should be able to add a row', function () {
        fetch.mockResponses(
            // Initial qpi call
            [
                JSON.stringify([]),
                {status: 200}
            ],
            [
                JSON.stringify([{}]),
                {status: 200}
            ],
            // API call after first add
            [
                JSON.stringify([{id: 1}]),
                {status: 200}
            ],
            // API call after second add
            [
                JSON.stringify([{id: 1}, {id: 2}]),
                {status: 200}
            ]
        );

        const {getByTestId, store} = renderWithRedux(<App/>, {
            initialState: initialState,
        });

        fireEvent.click(getByTestId('add-row'));
        fireEvent.click(getByTestId('final-add-row'));
        expect(store.getState().contacts.contacts.length).toBe(1);
        expect(store.getState().contacts.contacts[0].id).toBe(1);

        fireEvent.click(getByTestId('add-row'));
        fireEvent.click(getByTestId('final-add-row'));
        expect(store.getState().contacts.contacts.length).toBe(2);
        expect(store.getState().contacts.contacts[1].id).toBe(2);
    });

    it('should be able to edit a row', function () {
        fetch.mockResponses(
            [
                JSON.stringify([{id: 1, name: 'test1'}]),
                {status: 200}
            ],
            [
                JSON.stringify([{}]),
                {status: 200}
            ],
            [
                JSON.stringify([{id: 1, name: 'test1'}, {id: 2, name: 'test2'}]),
                {status: 200}
            ],
        );

        const newState = Object.assign({}, initialState, {
            contacts: {
                contacts: initialState.contacts.contacts.concat([{id: '1', name: 'test1'}])
            }
        });
        const {getByTestId, getByDisplayValue, store} = renderWithRedux(<App/>, {
            initialState: newState,
        });

        fireEvent.click(getByTestId('edit-row'));
        fireEvent.change(getByDisplayValue('test1'), {target: {value: 'test2'}});
        fireEvent.click(getByTestId('final-update-row'));
        expect(store.getState().contacts.contacts[0].name).toBe("test2");
    });

    it('should be able to select a row', function () {
        fetch.mockResponses(
            [
                JSON.stringify([{id: '1', name: 'test1'}, {id: '2', name: 'test2'}]),
                {status: 200}
            ],
            [
                JSON.stringify([]),
                {status: 200}
            ]
        );
        const newState = Object.assign({}, initialState, {
            contacts: {
                contacts: initialState.contacts.contacts.concat([{id: '1', name: 'test1'}, {id: '2', name: 'test2'}])
            }
        });
        const {getByTestId, getByText, store} = renderWithRedux(<App/>, {
            initialState: newState,
        });

        const firstRow = getByText('test1');
        fireEvent.click(firstRow);
        expect(firstRow.parentElement).toHaveClass('k-state-selected');
    });

    it('should be able to delete all rows', function () {
        fetch.mockResponses(
            [
                JSON.stringify([{id: '1', name: 'test1'}, {id: '2', name: 'test2'}]),
                {status: 200}
            ],
            [
                JSON.stringify([]),
                {status: 200}
            ],
            [
                JSON.stringify([]),
                {status: 200}
            ],
            [
                JSON.stringify([]),
                {status: 200}
            ],
            [
                JSON.stringify([]),
                {status: 200}
            ]
        );
        const newState = Object.assign({}, initialState, {
            contacts: {
                contacts: initialState.contacts.contacts.concat([{id: '1', name: 'test1'}, {id: '2', name: 'test2'}])
            }
        });
        const {getByTestId, getByText, store} = renderWithRedux(<App/>, {
            initialState: newState,
        });

        const rowOne = getByText('test1');
        const rowTwo = getByText('test2');
        fireEvent.click(rowOne);
        fireEvent.click(rowTwo);
        fireEvent.click(getByTestId('delete-selected-row'));

        let yesButton = getByTestId('dialog-yes');
        fireEvent.click(yesButton);
        yesButton = getByTestId('dialog-yes');
        fireEvent.click(yesButton);
        expect(rowOne).not.toBeInTheDocument();
        expect(rowTwo).not.toBeInTheDocument();
    });

    it('should be able to deselect a row', function () {
        fetch.mockResponses(
            [
                JSON.stringify([{id: '1', name: 'test1'}, {id: '2', name: 'test2'}]),
                {status: 200}
            ],
            [
                JSON.stringify([]),
                {status: 200}
            ]
        );
        const newState = Object.assign({}, initialState, {
            contacts: {
                contacts: initialState.contacts.contacts.concat([{id: '1', name: 'test1'}, {id: '2', name: 'test2'}])
            }
        });
        const {getByTestId, getByText, store} = renderWithRedux(<App/>, {
            initialState: newState,
        });

        const firstRow = getByText('test1');
        fireEvent.click(firstRow);
        expect(firstRow.parentElement).toHaveClass('k-state-selected');
        fireEvent.click(firstRow);
        expect(firstRow.parentElement).not.toHaveClass('k-state-selected');
    });

    it('should be able to delete a row', function () {
        fetch.mockResponses(
            [
                JSON.stringify([{id: '1', name: 'test1'}]),
                {status: 200}
            ],
            [
                JSON.stringify([]),
                {status: 200}
            ],
            [
                JSON.stringify([]),
                {status: 200}
            ],
            [
                JSON.stringify([]),
                {status: 200}
            ]
        );
        const newState = Object.assign({}, initialState, {
            contacts: {
                contacts: initialState.contacts.contacts.concat([{id: '1', name: 'test1'}])
            }
        });
        const {getByTestId, getByText, store} = renderWithRedux(<App/>, {
            initialState: newState,
        });

        const rowOne = getByText('test1');
        fireEvent.click(getByTestId('remove-row'));
        let yesButton = getByTestId('dialog-yes');
        fireEvent.click(yesButton);
        expect(rowOne).not.toBeInTheDocument();
    });

    it('should be able to refresh the table data', function () {
        fetch.mockResponses(
            [
                JSON.stringify([{id: '1', name: 'test1'}]),
                {status: 200}
            ],
            [
                JSON.stringify([]),
                {status: 200}
            ],
            [
                JSON.stringify([{id: '1', name: 'test1'}]),
                {status: 200}
            ],
        );
        const newState = Object.assign({}, initialState, {
            contacts: {
                contacts: initialState.contacts.contacts.concat([{id: '1', name: 'test1'}])
            }
        });
        const {getByTestId, getByDisplayValue, store} = renderWithRedux(<App/>, {
            initialState: newState,
        });

        const editButton = getByTestId('edit-row');
        expect(editButton).toBeInTheDocument();
        fireEvent.click(editButton);

        const name_element = getByDisplayValue('test1');
        fireEvent.change(name_element, {target: {value: 'wrongText'}});
        expect(name_element.value).toBe("wrongText");

        const cancelButton = getByTestId('final-cancel-row');
        expect(cancelButton).toBeInTheDocument();
        fireEvent.click(cancelButton);

        expect(store.getState().contacts.contacts.length).toBe(1);
    });
});