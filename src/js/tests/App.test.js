import React from "react";
import {applyMiddleware, createStore} from 'redux'
import {Provider} from 'react-redux'
import {render, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import rootReducer, {initialState} from '../reducers/index'
import App from '../App';
import thunk from "redux-thunk";

const api = '';
function renderWithRedux(
    ui,
    {initialState, store = createStore(rootReducer, initialState, applyMiddleware(thunk.withExtraArgument(api)))} = {}
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

    expect(getByText('User ID')).toBeInTheDocument();
    expect(getByText('Name')).toBeInTheDocument();
    expect(getByText('Username')).toBeInTheDocument();
    expect(getByText('Email')).toBeInTheDocument();
    expect(getByText('URL')).toBeInTheDocument();
});

it('should be able to sort columns', function () {
    const newState = Object.assign({}, initialState, {
        contacts: initialState.contacts.concat([
            {
                id: '1',
                name: 'b',
                username: 'bob',
                email: 'bob@bob.co',
                website: 'bob.co'
            },
            {
                id: '2',
                name: 'a',
                username: 'sally',
                email: 'sally@sally.co',
                website: 'sally.co'
            }])
    });
    const {getByTestId, store} = renderWithRedux(<App/>, {
        initialState: newState,
    });

    expect(store.getState().currentSortMethod).toBe("default");

    fireEvent.click(getByTestId('column-id'));
    expect(store.getState().currentSortMethod).toBe("dsc_by_id");
    fireEvent.click(getByTestId('column-id'));
    expect(store.getState().currentSortMethod).toBe("asc_by_id");

    fireEvent.click(getByTestId('column-name'));
    expect(store.getState().currentSortMethod).toBe("dsc_by_name");
    fireEvent.click(getByTestId('column-name'));
    expect(store.getState().currentSortMethod).toBe("asc_by_name");

    fireEvent.click(getByTestId('column-username'));
    expect(store.getState().currentSortMethod).toBe("dsc_by_username");
    fireEvent.click(getByTestId('column-username'));
    expect(store.getState().currentSortMethod).toBe("asc_by_username");

    fireEvent.click(getByTestId('column-email'));
    expect(store.getState().currentSortMethod).toBe("dsc_by_email");
    fireEvent.click(getByTestId('column-email'));
    expect(store.getState().currentSortMethod).toBe("asc_by_email");

    fireEvent.click(getByTestId('column-website'));
    expect(store.getState().currentSortMethod).toBe("dsc_by_website");
    fireEvent.click(getByTestId('column-website'));
    expect(store.getState().currentSortMethod).toBe("asc_by_website");
});

it('should be able to add a row', function () {
    const {getByTestId, store} = renderWithRedux(<App/>, {
        initialState: initialState,
    });

    fireEvent.click(getByTestId('add-row'));
    expect(store.getState().contacts.length).toBe(1);

    fireEvent.click(getByTestId('add-row'));
    expect(store.getState().contacts.length).toBe(2);
});

it('should be able to edit a row', function () {
    const {getByTestId, store} = renderWithRedux(<App/>, {
        initialState: initialState,
    });

    fireEvent.click(getByTestId('add-row'));
    expect(store.getState().contacts.length).toBe(1);

    const id_element = getByTestId('id-value');
    fireEvent.click(id_element);
    id_element.textContent = "1";
    fireEvent.blur(id_element);
    expect(store.getState().contacts[0].id).toBe("1");
});

it('should be able to select a row', function () {
    const {getByTestId, store} = renderWithRedux(<App/>, {
        initialState: initialState,
    });

    fireEvent.click(getByTestId('add-row'));
    expect(store.getState().contacts.length).toBe(1);
    fireEvent.click(getByTestId('select-row-single'));
    expect(store.getState().currentSelectedItems.length).toBe(1);
});

it('should be able to select all rows', function () {
    const newState = Object.assign({}, initialState, {
        contacts: initialState.contacts.concat([{id: '1', name: 'test'}, {id: '2', name: 'test'}])
    });
    const {getByTestId, store} = renderWithRedux(<App/>, {
        initialState: newState,
    });

    fireEvent.click(getByTestId('add-row'));
    expect(store.getState().contacts.length).toBe(3);
    fireEvent.click(getByTestId('add-row'));
    expect(store.getState().contacts.length).toBe(4);
    expect(store.getState().currentSelectedItems.length).toBe(0);
    fireEvent.click(getByTestId('select-all-rows'));
    expect(store.getState().currentSelectedItems.length).toBe(4);
});

it('should be able to delete all rows', function () {
    const newState = Object.assign({}, initialState, {
        contacts: initialState.contacts.concat([{id: '1', name: 'test'}, {id: '2', name: 'test'}])
    });
    const {getByTestId, store} = renderWithRedux(<App/>, {
        initialState: newState,
    });

    fireEvent.click(getByTestId('add-row'));
    expect(store.getState().contacts.length).toBe(3);
    fireEvent.click(getByTestId('add-row'));
    expect(store.getState().contacts.length).toBe(4);
    expect(store.getState().currentSelectedItems.length).toBe(0);
    fireEvent.click(getByTestId('select-all-rows'));
    expect(store.getState().currentSelectedItems.length).toBe(4);
    fireEvent.click(getByTestId('delete-row'));
    expect(store.getState().contacts.length).toBe(0);
    expect(store.getState().currentSelectedItems.length).toBe(0);
});

it('should be able to deselect a row', function () {
    const {getByTestId, store} = renderWithRedux(<App/>, {
        initialState: initialState,
    });

    fireEvent.click(getByTestId('add-row'));
    expect(store.getState().contacts.length).toBe(1);
    fireEvent.click(getByTestId('select-row-single'));
    expect(store.getState().currentSelectedItems.length).toBe(1);
    fireEvent.click(getByTestId('select-row-single'));
    expect(store.getState().currentSelectedItems.length).toBe(0);
});

it('should be able to delete a row', function () {
    const {getByTestId, store} = renderWithRedux(<App/>, {
        initialState: initialState,
    });

    fireEvent.click(getByTestId('add-row'));
    expect(store.getState().contacts.length).toBe(1);
    fireEvent.click(getByTestId('select-row-single'));
    fireEvent.click(getByTestId('delete-row'));
    expect(store.getState().contacts.length).toBe(0);
});

it('should be able to filter data using search', function () {
    const newState = Object.assign({}, initialState, {
        contacts: initialState.contacts.concat([{id: '1', name: 'test'}, {id: '2', name: 'test'}])
    });
    const {getByText, getByTestId, store} = renderWithRedux(<App/>, {
        initialState: newState,
    });

    let searchBox = getByTestId('search-filter');
    expect(searchBox).toBeInTheDocument();
    fireEvent.change(searchBox, {target: {value: '1'}});
    expect(searchBox.value).toBe("1");
    expect(store.getState().currentSearchFilter).toBe(searchBox.value);
    expect(getByText("1-1 of 2")).toBeInTheDocument();
});