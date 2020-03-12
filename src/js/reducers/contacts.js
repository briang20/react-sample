import {
    CLEAR_CONTACTS,
    MODIFY_CONTACT,
    REMOVE_CONTACT,
    UPDATE_CONTACTS
} from "../constants/action-types";

export default function contacts(state = {contacts: []}, action) {
    switch (action.type) {
        case UPDATE_CONTACTS:
            return Object.assign({}, state, {
                contacts: state.contacts.concat(action.payload)
            });
        case REMOVE_CONTACT:
            return Object.assign({}, state, {
                contacts: state.contacts.filter(contact => contact !== action.payload)
            });
        case MODIFY_CONTACT:
            return Object.assign({}, state, {
                contacts: state.contacts.map(contact => {
                    if (contact.id === action.payload.id)
                        return action.payload;
                    return contact;
                })
            });
        case CLEAR_CONTACTS:
            return Object.assign({}, state, {
                currentSelectedItems: [],
                contacts: []
            });
        default:
            return state;
    }
}