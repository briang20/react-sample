// src/js/reducers/index.js

import {
    ADD_CONTACT,
    REMOVE_CONTACT,
    MODIFY_CONTACT,
    CHANGE_SORTING,
    CHANGE_SEARCH_FILTER,
    ADD_SELECTED_ITEM,
    REMOVE_SELECTED_ITEM,
    CLEAR_SELECTED_ITEMS,
    CLEAR_CONTACTS,
    CLEAR_REPLAY
} from "../constants/action-types";

export const initialState = {
    contacts: [],
    currentSortMethod: 'default',
    currentSearchFilter: '',
    currentSelectedItems: [],
    replayBuffer: []
};

function rootReducer(state = initialState, action) {
    if (action.type === ADD_CONTACT) {
        return Object.assign({}, state, {
            contacts: state.contacts.concat(action.payload),
            replayBuffer: state.replayBuffer.concat({type: 'post', data: action.payload})
        });
    }
    if (action.type === REMOVE_CONTACT) {
        return Object.assign({}, state, {
            contacts: state.contacts.filter(contact => contact !== action.payload),
            replayBuffer: state.replayBuffer.concat({type: 'delete', data: action.payload})
        });
    }
    if (action.type === MODIFY_CONTACT) {
        return Object.assign({}, state, {
            contacts: state.contacts.map(obj => {
                if (obj === action.oldPayload)
                    return action.payload;
                return obj;
            }),
            replayBuffer: state.replayBuffer.concat({type: 'put', data: action.payload})
        });
    }
    if (action.type === CHANGE_SORTING) {
        return Object.assign({}, state, {
            currentSortMethod: action.payload
        });
    }
    if (action.type === CHANGE_SEARCH_FILTER) {
        return Object.assign({}, state, {
            currentSearchFilter: action.payload
        });
    }
    if (action.type === ADD_SELECTED_ITEM) {
        return Object.assign({}, state, {
            contacts: state.contacts.map(contact => {
                if (contact === action.payload)
                    contact.selected = true;
                return contact;
            }),
            currentSelectedItems: state.currentSelectedItems.concat(action.payload)
        });
    }
    if (action.type === REMOVE_SELECTED_ITEM) {
        return Object.assign({}, state, {
            contacts: state.contacts.map(contact => {
                if (contact === action.payload)
                    contact.selected = false;
                return contact;
            }),
            currentSelectedItems: state.currentSelectedItems.filter(item => item !== action.payload)
        });
    }
    if (action.type === CLEAR_SELECTED_ITEMS) {
        return Object.assign({}, state, {
            currentSelectedItems: [],
            contacts: state.contacts.map(obj => {
                obj.selected = false;
                return obj;
            })
        });
    }
    if (action.type === CLEAR_CONTACTS) {
        return Object.assign({}, state, {
            currentSelectedItems: [],
            contacts: []
        });
    }
    if (action.type === CLEAR_REPLAY) {
        return Object.assign({}, state, {
            replayBuffer: []
        });
    }

    return state;
}

export default rootReducer;