import {initialState} from "./index";
import {
    ADD_CONTACT, ADD_SELECTED_ITEM,
    CLEAR_CONTACTS,
    CLEAR_REPLAY, CLEAR_SELECTED_ITEMS,
    MODIFY_CONTACT,
    REMOVE_CONTACT, REMOVE_SELECTED_ITEM,
    UPDATE_CONTACTS
} from "../constants/action-types";


export default function contacts(state = {contacts: [], replayBuffer: [], currentSelectedItems: []}, action) {
    switch (action.type) {
        case UPDATE_CONTACTS:
            return Object.assign({}, state, {
                contacts: state.contacts.concat(action.payload)
            });
        case ADD_CONTACT:
            return Object.assign({}, state, {
                contacts: state.contacts.concat(action.payload),
                replayBuffer: state.replayBuffer.concat({type: 'post', data: action.payload})
            });
        case REMOVE_CONTACT:
            return Object.assign({}, state, {
                contacts: state.contacts.filter(contact => contact !== action.payload),
                replayBuffer: state.replayBuffer.concat({type: 'delete', data: action.payload})
            });
        case MODIFY_CONTACT:
            return Object.assign({}, state, {
                contacts: state.contacts.map(obj => {
                    if (obj === action.oldPayload) {
                        let newData = Object.assign({}, obj);
                        newData[action.payload.field] = action.payload.value;
                        return newData;
                    }
                    return obj;
                }),
                replayBuffer: state.replayBuffer.concat({type: 'put', data: action.payload})
            });
        case CLEAR_CONTACTS:
            return Object.assign({}, state, {
                currentSelectedItems: [],
                contacts: []
            });
        case CLEAR_REPLAY:
            return Object.assign({}, state, {
                replayBuffer: []
            });

        case ADD_SELECTED_ITEM:
            return Object.assign({}, state, {
                contacts: state.contacts.map(contact => {
                    if (contact === action.payload)
                        contact.selected = true;
                    return contact;
                }),
                currentSelectedItems: state.currentSelectedItems.concat(action.payload)
            });
        case REMOVE_SELECTED_ITEM:
            return Object.assign({}, state, {
                contacts: state.contacts.map(contact => {
                    if (contact === action.payload)
                        contact.selected = false;
                    return contact;
                }),
                currentSelectedItems: state.currentSelectedItems.filter(item => item !== action.payload)
            });
        case CLEAR_SELECTED_ITEMS:
            return Object.assign({}, state, {
                currentSelectedItems: [],
                contacts: state.contacts.map(obj => {
                    obj.selected = false;
                    return obj;
                })
            });
        default:
            return state;
    }
}