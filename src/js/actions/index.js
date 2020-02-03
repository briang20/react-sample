// src/actions/index.js

import {ADD_CONTACT, REMOVE_CONTACT, MODIFY_CONTACT, CHANGE_SORTING} from "../constants/action-types";

export function addContact(payload) {
    return {type: ADD_CONTACT, payload}
}

export function removeContact(payload) {
    return {type: REMOVE_CONTACT, payload}
}

export function modifyContact(oldPayload, payload) {
    return {type: MODIFY_CONTACT, oldPayload, payload}
}

export function changeSorting(payload) {
    return {type: CHANGE_SORTING, payload}
}