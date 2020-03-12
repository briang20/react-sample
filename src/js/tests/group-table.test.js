import App from "../App";
import GroupsTable from "../views/groups-table";
import {fireEvent, render} from "@testing-library/react";
import React from "react";
import {createMiddleware} from "redux-callapi-middleware";
import thunk from "redux-thunk";
import configureStore from "redux-mock-store";
import {BrowserRouter as Router} from "react-router-dom";
import {Provider} from "react-redux";

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

describe('testing group ui', () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    it('should render columns correctly', function () {
        fetch.mockResponse(JSON.stringify([]));
        const {getByText} = renderWithRedux(<App/>);

        expect(getByText('#')).toBeInTheDocument();
        expect(getByText('Name')).toBeInTheDocument();
    });

    it('should be able to add a row', function () {
        fetch.mockResponses(
            // Initial qpi call
            [
                JSON.stringify([]),
                {status: 200}
            ],
            [
                JSON.stringify([]),
                {status: 200}
            ],
            // API call after first add
            [
                JSON.stringify([{id: 1}]),
                {status: 200}
            ]
        );

        const {getByTestId, store} = renderWithRedux(<GroupsTable/>, {
            initialState: initialState,
        });

        fireEvent.click(getByTestId('add-row'));
        // TODO: set the name here
        fireEvent.click(getByTestId('final-add-row'));
    });
});