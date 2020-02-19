import React from "react";
import {applyMiddleware, createStore} from 'redux'
import {Provider} from 'react-redux'
import {render, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import reducer from '../reducers/index'
import App from '../App';
import thunk from "redux-thunk";
import {createMiddleware} from "redux-callapi-middleware";

const onSuccess = (response) => {
    if (!response.ok) {
        throw new Error('Error');
    }
    return response;
};

const fetchMock = require('fetch-mock/es5/client');
const callApi = (url, options) => fetch(url, options).then(onSuccess);
const apiMiddleware = createMiddleware({callApi});

const api = 'http://local';
const initialState = {
    contacts: {contacts: [], currentSelectedItems: []},
    sorter: {currentSearchFilter: ""}
};

const middleware = [thunk.withExtraArgument(api), apiMiddleware];

function renderWithRedux(
    ui,
    {initialState, store = createStore(reducer, initialState, applyMiddleware(...middleware))} = {}
) {
    return {
        ...render(<Provider store={store}>{ui}</Provider>),
        // adding `store` to the returned utilities to allow us
        // to reference it in our tests (just try to avoid using
        // this to test implementation details).
        store,
    }
}

it('should render columns correctly', function () {
    const {getByText} = renderWithRedux(<App/>);

    expect(getByText('#')).toBeInTheDocument();
    expect(getByText('Name')).toBeInTheDocument();
    expect(getByText('Username')).toBeInTheDocument();
    expect(getByText('Email')).toBeInTheDocument();
    expect(getByText('URL')).toBeInTheDocument();
});

it('should be able to add a row', async function () {
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
    const newState = Object.assign({}, initialState, {
        contacts: {
            contacts: initialState.contacts.contacts.concat([{id: '1', name: 'test1'}]),
            currentSelectedItems: initialState.contacts.currentSelectedItems
        }
    });
    const {getByTestId, getByText, store} = renderWithRedux(<App/>, {
        initialState: newState,
    });

    fireEvent.click(getByTestId('edit-row'));
    fireEvent.change(getByText('test1'), {target: {value: 'test2'}});
    fireEvent.click(getByTestId('final-update-row'));
    expect(store.getState().contacts.contacts[0].name).toBe("test2");
});

it('should not be able to edit a readonly column', function () {
    const {getByTestId, store} = renderWithRedux(<App/>, {
        initialState: initialState,
    });

    fireEvent.click(getByTestId('add-row'));
    fireEvent.click(getByTestId('final-add-row'));
    expect(store.getState().contacts.contacts.length).toBe(1);
    expect(store.getState().contacts.contacts[0].id).toBe(1);

    const id_element = getByTestId('id-input-1');
    fireEvent.change(id_element, {target: {value: '2'}});
    fireEvent.blur(id_element);
    expect(store.getState().contacts.contacts[0].id).toBe(1);
});

it('should be able to select a row', function () {
    const newState = Object.assign({}, initialState, {
        contacts: {
            contacts: initialState.contacts.contacts.concat([{id: '1', name: 'test1'}, {id: '2', name: 'test2'}]),
            currentSelectedItems: initialState.contacts.currentSelectedItems
        }
    });
    const {getByTestId, getByText, store} = renderWithRedux(<App/>, {
        initialState: newState,
    });

    const firstRow = getByText('test1');
    fireEvent.click(firstRow);
    expect(store.getState().contacts.contacts[0].selected).toBe(true);
});

it('should be able to delete all rows', function () {
    const newState = Object.assign({}, initialState, {
        contacts: {
            contacts: initialState.contacts.contacts.concat([{id: '1', name: 'test1'}, {id: '2', name: 'test2'}]),
            currentSelectedItems: initialState.contacts.currentSelectedItems
        }
    });
    const {getByTestId, getByText, store} = renderWithRedux(<App/>, {
        initialState: newState,
    });

    fireEvent.click(getByText('test1'));
    fireEvent.click(getByText('test2'));
    fireEvent.click(getByTestId('delete-selected-row'));
    expect(store.getState().contacts.contacts.length).toBe(0);
});

it('should be able to deselect a row', function () {
    const newState = Object.assign({}, initialState, {
        contacts: {
            contacts: initialState.contacts.contacts.concat([{id: '1', name: 'test1'}, {id: '2', name: 'test2'}]),
            currentSelectedItems: initialState.contacts.currentSelectedItems
        }
    });
    const {getByTestId, getByText, store} = renderWithRedux(<App/>, {
        initialState: newState,
    });

    fireEvent.click(getByText('test1'));
    expect(store.getState().contacts.contacts[0].selected).toBe(true);
    fireEvent.click(getByText('test1'));
    expect(store.getState().contacts.contacts[0].selected).toBe(false);
});

it('should be able to delete a row', function () {
    const newState = Object.assign({}, initialState, {
        contacts: {
            contacts: initialState.contacts.contacts.concat([{id: '1', name: 'test1'}]),
            currentSelectedItems: initialState.contacts.currentSelectedItems
        }
    });
    const {getByTestId, getByText, store} = renderWithRedux(<App/>, {
        initialState: newState,
    });

    fireEvent.click(getByTestId('remove-row'));
    expect(store.getState().contacts.contacts.length).toBe(0);
});

it('should be able to refresh the table data', function () {
    const newState = Object.assign({}, initialState, {
        contacts: {
            contacts: initialState.contacts.contacts.concat([{id: '1', name: 'test1'}]),
            currentSelectedItems: initialState.contacts.currentSelectedItems
        }
    });
    const {getByTestId, getByText, store} = renderWithRedux(<App/>, {
        initialState: newState,
    });

    const editButton = getByTestId('edit-row');
    expect(editButton).toBeInTheDocument();
    fireEvent.click(editButton);

    const name_element = getByText('test1');
    fireEvent.change(name_element, {target: {value: 'wrongText'}});
    expect(name_element.value).toBe("wrongText");

    const refreshButton = getByTestId('refresh-table');
    expect(refreshButton).toBeInTheDocument();
    fireEvent.click(refreshButton);

    expect(store.getState().contacts.contacts.length).toBe(1);
    expect(name_element.value).toBe("test1");
});

// it('should be able to save the table data replay buffer', async function () {
//     const newState = Object.assign({}, initialState, {
//         contacts: {
//             contacts: initialState.contacts.contacts.concat([{id: '1', name: 'test1'}, {id: '2', name: 'test2'}]),
//             currentSelectedItems: initialState.contacts.currentSelectedItems
//         }
//     });
//     fetchMock
//         .getOnce(api, {
//             status: 200,
//             body: [{id: '1', name: 'test1'}, {id: '2', name: 'test2'}]
//         }, {overwriteRoutes: false})
//         .getOnce(api, {status: 200, body: [{id: '1', name: 'test1'}, {id: '2', name: 'test2'}, {id: '3', name: 'test3'}]}, {overwriteRoutes: false})
//         .postOnce(api, 400)
//         .putOnce(api + '/1', {status: 200, body: {id: 1, name: 'wrongText'}})
//         .done();
//
//     const {getByTestId, store} = renderWithRedux(<App/>, {
//         initialState: newState,
//     });
//
//     const addButton = getByTestId('add-row');
//     expect(addButton).toBeInTheDocument();
//     fireEvent.click(addButton);
//     fireEvent.click(getByTestId('final-add-row'));
//     expect(store.getState().contacts.contacts.length).toBe(3);
//
//     const name_element = getByTestId('name-input-1');
//     expect(name_element).toBeInTheDocument();
//     fireEvent.change(name_element, {target: {value: 'wrongText'}});
//     fireEvent.blur(name_element);
//     expect(name_element.value).toBe("wrongText");
//
//     const refreshButton = getByTestId('refresh-table');
//     expect(refreshButton).toBeInTheDocument();
//     await fireEvent.click(refreshButton);
//
//     expect(store.getState().contacts.contacts[0].name).toBe("wrongText");
//     fetchMock.reset();
// });