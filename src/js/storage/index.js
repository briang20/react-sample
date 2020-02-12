import {createStore, applyMiddleware} from "redux";
import thunk from 'redux-thunk';
import {createMiddleware} from 'redux-callapi-middleware';
import reducer from "../reducers";

//const api = process.env.BASE_API_URL;
const api = require('../../.settings.json').main.apiUrl;

const onSuccess = (response) => {
    if (!response.ok) {
        throw new Error('Error');
    }
    return response;
}

const callApi = (url, options) => fetch(url, options).then(onSuccess);
const apiMiddleware = createMiddleware({callApi});

const middleware = [thunk.withExtraArgument(api), apiMiddleware];

export default function configureStore(initialState) {
    return createStore(reducer,
        {},
        applyMiddleware(...middleware)
    );
}