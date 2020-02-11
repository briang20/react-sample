import {createStore, applyMiddleware} from "redux";
import thunk from 'redux-thunk';
import reducer from "../reducers";

//const api = process.env.BASE_API_URL;
const api = require('../../.settings.json').main.apiUrl;

export default function configureStore(initialState) {
    console.log(reducer)
    return createStore(reducer,
        {},
        applyMiddleware(thunk.withExtraArgument(api))
    );
}